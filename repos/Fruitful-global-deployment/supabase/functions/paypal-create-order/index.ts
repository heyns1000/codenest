import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CreateOrderRequest {
  amount: number;
  currency: string;
  items: Array<{
    name: string;
    quantity: number;
    unit_amount: number;
  }>;
  userId?: string;
  returnUrl?: string;
  cancelUrl?: string;
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

async function createPayPalOrder(accessToken: string, orderData: CreateOrderRequest) {
  const response = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{
        amount: {
          currency_code: orderData.currency,
          value: orderData.amount.toFixed(2),
          breakdown: {
            item_total: {
              currency_code: orderData.currency,
              value: orderData.amount.toFixed(2),
            },
          },
        },
        items: orderData.items.map(item => ({
          name: item.name,
          quantity: item.quantity.toString(),
          unit_amount: {
            currency_code: orderData.currency,
            value: item.unit_amount.toFixed(2),
          },
        })),
      }],
      application_context: {
        brand_name: "Nexus Nair",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: orderData.returnUrl || `${Deno.env.get("SUPABASE_URL")?.replace('/functions/v1', '')}/payment-return?provider=paypal`,
        cancel_url: orderData.cancelUrl || `${Deno.env.get("SUPABASE_URL")?.replace('/functions/v1', '')}/payment-cancel?provider=paypal`,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`PayPal order creation failed: ${error}`);
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

    const orderData: CreateOrderRequest = await req.json();

    if (!orderData.amount || orderData.amount <= 0) {
      throw new Error("Invalid amount");
    }

    const accessToken = await getPayPalAccessToken();
    const order = await createPayPalOrder(accessToken, orderData);

    const approvalUrl = order.links.find((link: any) => link.rel === "approve")?.href;

    return new Response(
      JSON.stringify({
        orderId: order.id,
        approvalUrl,
        status: order.status,
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
        error: error.message || "Payment processing failed",
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