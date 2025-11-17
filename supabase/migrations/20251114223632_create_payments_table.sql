/*
  # Create Payments Table for Edge Functions

  ## Overview
  Add a payments table for tracking payments processed by Edge Functions.
  This complements the existing payment_transactions table.

  ## New Tables

  ### payments
    - `id` (uuid, primary key)
    - `user_id` (uuid, nullable) - User who made the payment
    - `amount` (numeric) - Payment amount
    - `currency` (text) - Currency code (USD, ZAR, etc.)
    - `payment_method` (text) - Payment gateway (paypal, payfast)
    - `payment_status` (text) - Payment status (pending, completed, failed)
    - `transaction_id` (text) - External gateway transaction ID
    - `gateway_response` (jsonb) - Full gateway response data
    - `created_at` (timestamptz) - Payment creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  ## Security
    - Row Level Security (RLS) enabled
    - Service role can perform all operations
    - Authenticated users can view their own payments

  ## Indexes
    - Index on user_id for user payment lookups
    - Index on transaction_id for gateway verification
    - Index on payment_status for status filtering
*/

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  amount numeric NOT NULL CHECK (amount >= 0),
  currency text NOT NULL DEFAULT 'USD',
  payment_method text NOT NULL CHECK (payment_method IN ('paypal', 'payfast')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id text,
  gateway_response jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can do everything on payments"
  ON payments FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
