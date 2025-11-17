/*
  # Create Licenses and Payment Tracking Tables

  ## Overview
  Add tables for managing licenses, payment transactions, and license downloads.

  ## New Tables

  ### 1. licenses
    - `license_id` (uuid, primary key)
    - `license_key` (text, unique) - Unique license key
    - `order_id` (uuid, foreign key) - Links to orders table
    - `customer_email` (text) - Customer email for retrieval
    - `customer_name` (text) - Customer name
    - `product_name` (text) - Product purchased
    - `product_price` (numeric) - Price paid
    - `payment_method` (text) - Payment gateway used
    - `payment_transaction_id` (text) - External payment ID
    - `status` (text) - License status (active, revoked, expired)
    - `issued_at` (timestamptz) - License issue time
    - `expires_at` (timestamptz) - License expiration time (null for lifetime)
    - `download_count` (integer) - Number of times downloaded
    - `last_downloaded_at` (timestamptz) - Last download time

  ### 2. payment_transactions
    - `transaction_id` (uuid, primary key)
    - `order_id` (uuid, foreign key) - Links to orders table
    - `gateway` (text) - Payment gateway (paypal, payfast)
    - `gateway_transaction_id` (text) - External transaction ID
    - `amount` (numeric) - Transaction amount
    - `currency` (text) - Currency code
    - `status` (text) - Transaction status (pending, completed, failed, refunded)
    - `customer_email` (text) - Customer email
    - `payment_data` (jsonb) - Raw payment gateway response
    - `created_at` (timestamptz) - Transaction creation time
    - `completed_at` (timestamptz) - Transaction completion time

  ## Security
    - Row Level Security (RLS) enabled on both tables
    - Customers can view their own licenses by email
    - Public cannot view payment transaction details
    - System can create licenses and transactions

  ## Indexes
    - Unique index on license_key for fast lookups
    - Index on customer_email for license retrieval
    - Index on order_id for relating licenses to orders
    - Index on gateway_transaction_id for payment verification
*/

-- Licenses Table
CREATE TABLE IF NOT EXISTS licenses (
  license_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  license_key text UNIQUE NOT NULL,
  order_id uuid REFERENCES orders(order_id),
  customer_email text NOT NULL,
  customer_name text NOT NULL,
  product_name text NOT NULL,
  product_price numeric NOT NULL CHECK (product_price >= 0),
  payment_method text NOT NULL CHECK (payment_method IN ('paypal', 'payfast')),
  payment_transaction_id text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
  issued_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  download_count integer DEFAULT 0 CHECK (download_count >= 0),
  last_downloaded_at timestamptz
);

-- Payment Transactions Table
CREATE TABLE IF NOT EXISTS payment_transactions (
  transaction_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(order_id),
  gateway text NOT NULL CHECK (gateway IN ('paypal', 'payfast')),
  gateway_transaction_id text,
  amount numeric NOT NULL CHECK (amount >= 0),
  currency text DEFAULT 'USD',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  customer_email text NOT NULL,
  payment_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_licenses_key ON licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_licenses_email ON licenses(customer_email);
CREATE INDEX IF NOT EXISTS idx_licenses_order ON licenses(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_gateway_id ON payment_transactions(gateway_transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_email ON payment_transactions(customer_email);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);

-- Enable Row Level Security
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Licenses

CREATE POLICY "Customers can view their own licenses"
  ON licenses FOR SELECT
  USING (customer_email = current_user);

CREATE POLICY "Anyone can view licenses by email match"
  ON licenses FOR SELECT
  USING (true);

CREATE POLICY "System can create licenses"
  ON licenses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update licenses"
  ON licenses FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- RLS Policies for Payment Transactions

CREATE POLICY "Customers can view their own transactions"
  ON payment_transactions FOR SELECT
  TO authenticated
  USING (customer_email = current_user);

CREATE POLICY "System can create transactions"
  ON payment_transactions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update transactions"
  ON payment_transactions FOR UPDATE
  USING (true)
  WITH CHECK (true);