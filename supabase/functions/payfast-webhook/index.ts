import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function generateMD5(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("MD5", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generatePayFastSignature(data: Record<string, string>, passphrase: string): string {
  const sortedKeys = Object.keys(data)
    .filter(key => key !== 'signature')
    .sort();

  const params = sortedKeys
    .map(key => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, '+')}`)
    .join('&');

  return params + `&passphrase=${encodeURIComponent(passphrase)}`;
}

async function verifyPayFastSignature(data: Record<string, string>): Promise<boolean> {
  const passphrase = Deno.env.get("PAYFAST_PASSPHRASE");
  if (!passphrase) {
    throw new Error("PayFast passphrase not configured");
  }

  const receivedSignature = data.signature;
  if (!receivedSignature) {
    return false;
  }

  const signatureString = generatePayFastSignature(data, passphrase);
  const calculatedSignature = await generateMD5(signatureString);

  return calculatedSignature === receivedSignature;
}

async function verifyPayFastPayment(data: Record<string, string>): Promise<boolean> {
  const pfParamString = Object.keys(data)
    .filter(key => key !== 'signature')
    .sort()
    .map(key => `${key}=${encodeURIComponent(data[key])}`)
    .join('&');

  const response = await fetch('https://sandbox.payfast.co.za/eng/query/validate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: pfParamString,
  });

  const result = await response.text();
  return result === 'VALID';
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

    const formData = await req.formData();
    const data: Record<string, string> = {};

    for (const [key, value] of formData.entries()) {
      data[key] = value.toString();
    }

    console.log("PayFast ITN received:", data);

    const isSignatureValid = await verifyPayFastSignature(data);
    if (!isSignatureValid) {
      console.error("Invalid PayFast signature");
      return new Response("Invalid signature", { status: 400 });
    }

    const isPaymentValid = await verifyPayFastPayment(data);
    if (!isPaymentValid) {
      console.error("PayFast payment validation failed");
      return new Response("Invalid payment", { status: 400 });
    }

    if (data.payment_status === "COMPLETE") {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { data: payment, error: paymentError } = await supabase
          .from("payments")
          .insert({
            user_id: data.custom_str1 || null,
            amount: parseFloat(data.amount_gross),
            currency: "ZAR",
            payment_method: "payfast",
            payment_status: "completed",
            transaction_id: data.pf_payment_id,
            gateway_response: data,
          })
          .select()
          .single();

        if (paymentError) {
          console.error("Failed to record payment:", paymentError);
          return new Response("Database error", { status: 500 });
        }

        if (payment && data.custom_str2) {
          const licenseKey = crypto.randomUUID();

          const { error: licenseError } = await supabase
            .from("licenses")
            .insert({
              license_key: licenseKey,
              license_type: data.custom_str2,
              user_id: data.custom_str1 || null,
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

    return new Response("OK", {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("PayFast webhook error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Webhook processing failed",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});