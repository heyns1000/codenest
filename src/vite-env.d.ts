/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_PAYPAL_CLIENT_ID: string;
  readonly VITE_PAYFAST_MERCHANT_ID: string;
  readonly VITE_PAYFAST_MERCHANT_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  paypal?: any;
}
