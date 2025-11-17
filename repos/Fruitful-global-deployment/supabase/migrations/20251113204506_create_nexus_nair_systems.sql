/*
  # Fruitful Global Planet - NEXUS_NAIR Database Schema

  ## Overview
  Complete database schema for all 6 NEXUS_NAIR systems powering Fruitful Global Planet.

  ## New Tables

  ### 1. ClaimRoot™ - Blockchain Claims System
    - `claims` - Asset ownership claims with blockchain-style hashing
      - `claim_id` (uuid, primary key)
      - `owner` (text) - Owner identifier
      - `asset` (text) - Asset being claimed
      - `timestamp` (timestamptz) - Claim creation time
      - `previous_hash` (text) - Previous block hash
      - `current_hash` (text) - Current block hash
      - `metadata` (jsonb) - Additional claim data

  ### 2. PulseTrade™ - 9-Second Pulse Trading
    - `trades` - Trading transactions synchronized every 9 seconds
      - `trade_id` (uuid, primary key)
      - `from_id` (text) - Sender identifier
      - `to_id` (text) - Recipient identifier
      - `asset` (text) - Asset being traded
      - `amount` (numeric) - Trade amount
      - `pulse_number` (bigint) - Pulse cycle number
      - `timestamp` (timestamptz) - Trade creation time
      - `status` (text) - Trade status (pending, completed, failed)

  ### 3. BareCart™ - Zero-Waste Commerce
    - `products` - Product catalog
      - `item_id` (uuid, primary key)
      - `name` (text) - Product name
      - `price` (numeric) - Product price in USD
      - `quantity` (integer) - Available quantity
      - `grains_per_unit` (integer) - Grains counted per unit
      - `created_at` (timestamptz) - Product creation time
    
    - `orders` - Customer orders
      - `order_id` (uuid, primary key)
      - `cart_id` (text) - Shopping cart identifier
      - `customer_id` (text) - Customer identifier
      - `total_amount` (numeric) - Order total in USD
      - `total_grains` (bigint) - Total grains counted
      - `timestamp` (timestamptz) - Order creation time
      - `status` (text) - Order status

  ### 4. 40D Store - 40-Dimensional Storage
    - `store_40d` - Multi-dimensional data storage
      - `data_id` (uuid, primary key)
      - `data` (text) - Stored data
      - `dimensions` (jsonb) - Dimensional coordinates
      - `timestamp` (timestamptz) - Storage time

  ### 5. VaultMesh™ - DNA Node Network
    - `mesh_nodes` - Distributed mesh network nodes
      - `node_id` (uuid, primary key)
      - `node_type` (text) - Node type (genome, dna, vault)
      - `genome_hash` (text) - Genome identifier
      - `dna_count` (integer) - Number of DNA strands
      - `open_source` (boolean) - Open source status
      - `created_at` (timestamptz) - Node creation time

  ### 6. Consultant System
    - `consultants` - Consultant licenses ($29 USD)
      - `consultant_id` (uuid, primary key)
      - `email` (text, unique) - Consultant email
      - `name` (text) - Consultant name
      - `paypal_transaction_id` (text) - PayPal payment verification
      - `license_date` (timestamptz) - License activation date
      - `status` (text) - Account status (active, inactive)

  ### 7. Care Loop™ - Animal Rescue Fund (15% revenue)
    - `care_loop_transactions` - Donations to Banimals™
      - `transaction_id` (uuid, primary key)
      - `source_order_id` (uuid) - Source order/payment
      - `amount` (numeric) - Donation amount
      - `beneficiary` (text) - Recipient organization
      - `timestamp` (timestamptz) - Donation time
      - `animals_helped` (numeric) - Estimated animals helped

  ## Security
    - Row Level Security (RLS) enabled on all tables
    - Policies restrict access to authenticated users
    - Consultants can only access their own data
    - Public read access for products catalog

  ## Indexes
    - Performance indexes on frequently queried columns
    - Timestamp indexes for time-series queries
    - Email unique constraint for consultants
*/

-- ClaimRoot™ Claims Table
CREATE TABLE IF NOT EXISTS claims (
  claim_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner text NOT NULL,
  asset text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  previous_hash text,
  current_hash text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- PulseTrade™ Trades Table
CREATE TABLE IF NOT EXISTS trades (
  trade_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_id text NOT NULL,
  to_id text NOT NULL,
  asset text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  pulse_number bigint NOT NULL,
  timestamp timestamptz DEFAULT now(),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed'))
);

-- BareCart™ Products Table
CREATE TABLE IF NOT EXISTS products (
  item_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  quantity integer NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  grains_per_unit integer DEFAULT 1 CHECK (grains_per_unit > 0),
  created_at timestamptz DEFAULT now()
);

-- BareCart™ Orders Table
CREATE TABLE IF NOT EXISTS orders (
  order_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id text NOT NULL,
  customer_id text NOT NULL,
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  total_grains bigint NOT NULL DEFAULT 0,
  timestamp timestamptz DEFAULT now(),
  status text DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled', 'refunded'))
);

-- 40D Store Table
CREATE TABLE IF NOT EXISTS store_40d (
  data_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  data text NOT NULL,
  dimensions jsonb NOT NULL DEFAULT '{}'::jsonb,
  timestamp timestamptz DEFAULT now()
);

-- VaultMesh™ Nodes Table
CREATE TABLE IF NOT EXISTS mesh_nodes (
  node_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  node_type text NOT NULL CHECK (node_type IN ('genome', 'dna', 'vault')),
  genome_hash text,
  dna_count integer DEFAULT 0 CHECK (dna_count >= 0),
  open_source boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Consultants Table
CREATE TABLE IF NOT EXISTS consultants (
  consultant_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  paypal_transaction_id text,
  license_date timestamptz DEFAULT now(),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended'))
);

-- Care Loop Transactions Table
CREATE TABLE IF NOT EXISTS care_loop_transactions (
  transaction_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_order_id uuid,
  amount numeric NOT NULL CHECK (amount > 0),
  beneficiary text DEFAULT 'Banimals',
  timestamp timestamptz DEFAULT now(),
  animals_helped numeric
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_claims_owner ON claims(owner);
CREATE INDEX IF NOT EXISTS idx_claims_timestamp ON claims(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_trades_pulse ON trades(pulse_number DESC);
CREATE INDEX IF NOT EXISTS idx_trades_status ON trades(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_timestamp ON orders(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_consultants_email ON consultants(email);
CREATE INDEX IF NOT EXISTS idx_consultants_status ON consultants(status);

-- Enable Row Level Security
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_40d ENABLE ROW LEVEL SECURITY;
ALTER TABLE mesh_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultants ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_loop_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Claims: Users can view all claims, authenticated users can create
CREATE POLICY "Anyone can view claims"
  ON claims FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create claims"
  ON claims FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Trades: Authenticated users can view their own trades
CREATE POLICY "Users can view their own trades"
  ON trades FOR SELECT
  TO authenticated
  USING (from_id = current_user OR to_id = current_user);

CREATE POLICY "Authenticated users can create trades"
  ON trades FOR INSERT
  TO authenticated
  WITH CHECK (from_id = current_user);

-- Products: Public read, authenticated insert/update
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Orders: Users can view their own orders
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (customer_id = current_user);

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- 40D Store: Authenticated users only
CREATE POLICY "Authenticated users can view 40D data"
  ON store_40d FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can store 40D data"
  ON store_40d FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Mesh Nodes: Public read, authenticated write
CREATE POLICY "Anyone can view mesh nodes"
  ON mesh_nodes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create mesh nodes"
  ON mesh_nodes FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Consultants: Users can view their own profile
CREATE POLICY "Consultants can view own profile"
  ON consultants FOR SELECT
  TO authenticated
  USING (email = current_user);

CREATE POLICY "Anyone can register as consultant"
  ON consultants FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Consultants can update own profile"
  ON consultants FOR UPDATE
  TO authenticated
  USING (email = current_user)
  WITH CHECK (email = current_user);

-- Care Loop: Public read for transparency
CREATE POLICY "Anyone can view care loop transactions"
  ON care_loop_transactions FOR SELECT
  USING (true);

CREATE POLICY "System can create care loop transactions"
  ON care_loop_transactions FOR INSERT
  WITH CHECK (true);