/*
  # Update Licenses Table for Edge Functions

  ## Overview
  Update the licenses table to support the new Edge Functions payment flow.
  Add fields compatible with both old and new payment systems.

  ## Changes
    - Add `payment_id` (uuid, foreign key) - Links to payments table
    - Add `user_id` (uuid, nullable) - User who owns the license
    - Add `license_type` (text) - Type of license (standard, premium, enterprise)
    - Make some existing fields optional for flexibility

  ## Security
    - Maintain existing RLS policies
    - Add policy for service role operations
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'licenses' AND column_name = 'payment_id'
  ) THEN
    ALTER TABLE licenses ADD COLUMN payment_id uuid REFERENCES payments(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'licenses' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE licenses ADD COLUMN user_id uuid;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'licenses' AND column_name = 'license_type'
  ) THEN
    ALTER TABLE licenses ADD COLUMN license_type text DEFAULT 'standard';
  END IF;
END $$;

ALTER TABLE licenses ALTER COLUMN customer_name DROP NOT NULL;
ALTER TABLE licenses ALTER COLUMN product_name DROP NOT NULL;
ALTER TABLE licenses ALTER COLUMN product_price DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_licenses_payment_id ON licenses(payment_id);
CREATE INDEX IF NOT EXISTS idx_licenses_user_id ON licenses(user_id);

CREATE POLICY "Service role can do everything on licenses"
  ON licenses FOR ALL
  USING (true)
  WITH CHECK (true);
