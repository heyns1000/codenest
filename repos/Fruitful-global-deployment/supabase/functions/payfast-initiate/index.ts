import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PayFastRequest {
  amount: number;
  itemName: string;
  itemDescription?: string;
  email?: string;
  nameFirst?: string;
  nameLast?: string;
  userId?: string;
  licenseType: string;
}

async function generateMD5(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("MD5", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generatePayFastSignature(data: Record<string, string>, passphrase: string): string {
  const sortedKeys = Object.keys(data).sort();
  const params = sortedKeys
    .map(key => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, '+')}`)
    .join('&');

  return params + `&passphrase=${encodeURIComponent(passphrase)}`;
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

    const requestData: PayFastRequest = await req.json();

    if (!requestData.amount || requestData.amount <= 0) {
      throw new Error("Invalid amount");
    }

    const merchantId = Deno.env.get("PAYFAST_MERCHANT_ID");
    const merchantKey = Deno.env.get("PAYFAST_MERCHANT_KEY");
    const passphrase = Deno.env.get("PAYFAST_PASSPHRASE");

    if (!merchantId || !merchantKey || !passphrase) {
      throw new Error("PayFast credentials not configured");
    }

    const baseUrl = Deno.env.get("SUPABASE_URL")?.replace('/functions/v1', '') || "";
    const returnUrl = `${baseUrl}/payment-return?provider=payfast`;
    const cancelUrl = `${baseUrl}/payment-cancel?provider=payfast`;
    const notifyUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/payfast-webhook`;

    const paymentData: Record<string, string> = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: returnUrl,
      cancel_url: cancelUrl,
      notify_url: notifyUrl,
      name_first: requestData.nameFirst || "Customer",
      name_last: requestData.nameLast || "",
      email_address: requestData.email || "customer@example.com",
      m_payment_id: crypto.randomUUID(),
      amount: requestData.amount.toFixed(2),
      item_name: requestData.itemName,
      item_description: requestData.itemDescription || requestData.itemName,
      custom_str1: requestData.userId || "",
      custom_str2: requestData.licenseType,
    };

    const signatureString = generatePayFastSignature(paymentData, passphrase);
    const signature = await generateMD5(signatureString);

    return new Response(
      JSON.stringify({
        paymentUrl: "https://sandbox.payfast.co.za/eng/process",
        paymentData: {
          ...paymentData,
          signature,
        },
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
        error: error.message || "Payment initiation failed",
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