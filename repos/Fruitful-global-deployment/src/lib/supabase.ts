import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Consultant {
  consultant_id: string;
  email: string;
  name: string;
  paypal_transaction_id: string | null;
  license_date: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface Product {
  item_id: string;
  name: string;
  price: number;
  quantity: number;
  grains_per_unit: number;
  created_at: string;
}

export interface Trade {
  trade_id: string;
  from_id: string;
  to_id: string;
  asset: string;
  amount: number;
  pulse_number: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface Claim {
  claim_id: string;
  owner: string;
  asset: string;
  timestamp: string;
  previous_hash: string | null;
  current_hash: string;
  metadata: Record<string, any>;
}

export interface CareLoopTransaction {
  transaction_id: string;
  source_order_id: string | null;
  amount: number;
  beneficiary: string;
  timestamp: string;
  animals_helped: number | null;
}
