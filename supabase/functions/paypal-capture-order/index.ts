import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CaptureOrderRequest {
  orderId: string;
  userId?: string;
  licenseType: string;
  amount: number;
}

async function getPayPalAccessToken(): Promise<string> {
  const clientId = Deno.env.get("PAYPAL_CLIENT_ID_SANDBOX");
  const clientSecret = Deno.env.get("PAYPAL_SECRET_SANDBOX");

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials not configured");
  }

  const auth = btoa(`${clientId}:${clientSecret}`);

  const response = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error(`PayPal auth failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function capturePayPalOrder(accessToken: string, orderId: string) {
  const response = await fetch(
    `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`PayPal capture failed: ${error}`);
  }

  return await response.json();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      throw new Error("Method not allowed");
    }

    const requestData: CaptureOrderRequest = await req.json();

    if (!requestData.orderId) {
      throw new Error("Order ID is required");
    }

    const accessToken = await getPayPalAccessToken();
    const captureData = await capturePayPalOrder(accessToken, requestData.orderId);

    const captureStatus = captureData.status;
    const paymentCapture = captureData.purchase_units?.[0]?.payments?.captures?.[0];

    if (captureStatus === "COMPLETED" && paymentCapture) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { data: payment, error: paymentError } = await supabase
          .from("payments")
          .insert({
            user_id: requestData.userId || null,
            amount: parseFloat(paymentCapture.amount.value),
            currency: paymentCapture.amount.currency_code,
            payment_method: "paypal",
            payment_status: "completed",
            transaction_id: paymentCapture.id,
            gateway_response: captureData,
          })
          .select()
          .single();

        if (paymentError) {
          console.error("Failed to record payment:", paymentError);
        }

        if (payment && requestData.licenseType) {
          const licenseKey = crypto.randomUUID();

          const { error: licenseError } = await supabase
            .from("licenses")
            .insert({
              license_key: licenseKey,
              license_type: requestData.licenseType,
              user_id: requestData.userId || null,
              payment_id: payment.id,
              status: "active",
              expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            });

          if (licenseError) {
            console.error("Failed to create license:", licenseError);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        orderId: requestData.orderId,
        status: captureStatus,
        captureId: paymentCapture?.id,
        amount: paymentCapture?.amount,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message || "Payment capture failed",
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});