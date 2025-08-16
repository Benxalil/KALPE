/*
  # Agent System Database Schema

  1. New Tables
    - `profiles` (extend existing users)
      - `agent_kalpe` (boolean, default false)
    - `agent_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `first_name` (text, required)
      - `last_name` (text, required)
      - `phone` (text, required)
      - `address` (text, required)
      - `id_document` (text, required - file path)
      - `status` (enum: pending, approved, rejected)
      - `created_at` (timestamp)
    - `agent_transactions`
      - `id` (uuid, primary key)
      - `transaction_type` (enum: deposit, withdrawal, transfer, payment)
      - `amount` (decimal, required)
      - `commission` (decimal, required)
      - `date` (timestamp, default now)
      - `agent_id` (uuid, references auth.users)
      - `client_id` (uuid, references auth.users)
      - `status` (enum: pending, completed, failed)
      - `reference` (text, unique)
    - `agent_balances`
      - `agent_id` (uuid, primary key, references auth.users)
      - `balance` (decimal, default 0)
      - `total_commissions` (decimal, default 0)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for agents and clients
    - Secure file upload for documents

  3. Functions
    - Function to update agent balance
    - Function to calculate commissions
*/

-- Create enum types
CREATE TYPE agent_request_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'transfer', 'payment');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');

-- Extend profiles table (assuming it exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'agent_kalpe') THEN
    ALTER TABLE profiles ADD COLUMN agent_kalpe boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'full_name') THEN
    ALTER TABLE profiles ADD COLUMN full_name text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'phone') THEN
    ALTER TABLE profiles ADD COLUMN phone text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'kalpe_id') THEN
    ALTER TABLE profiles ADD COLUMN kalpe_id text UNIQUE DEFAULT ('KLP-' || substr(gen_random_uuid()::text, 1, 8));
  END IF;
END $$;

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  phone text,
  agent_kalpe boolean DEFAULT false,
  kalpe_id text UNIQUE DEFAULT ('KLP-' || substr(gen_random_uuid()::text, 1, 8)),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create agent_requests table
CREATE TABLE IF NOT EXISTS agent_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  id_document text NOT NULL,
  status agent_request_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_pending_request UNIQUE (user_id, status)
);

-- Create agent_transactions table
CREATE TABLE IF NOT EXISTS agent_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_type transaction_type NOT NULL,
  amount decimal(15,2) NOT NULL,
  commission decimal(15,2) NOT NULL DEFAULT 0,
  date timestamptz DEFAULT now(),
  agent_id uuid REFERENCES auth.users NOT NULL,
  client_id uuid REFERENCES auth.users NOT NULL,
  status transaction_status DEFAULT 'pending',
  reference text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create agent_balances table
CREATE TABLE IF NOT EXISTS agent_balances (
  agent_id uuid PRIMARY KEY REFERENCES auth.users,
  balance decimal(15,2) DEFAULT 0,
  total_commissions decimal(15,2) DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_balances ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policies for agent_requests
CREATE POLICY "Users can view their own requests"
  ON agent_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own requests"
  ON agent_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for agent_transactions
CREATE POLICY "Agents can view their transactions"
  ON agent_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = agent_id);

CREATE POLICY "Agents can create transactions"
  ON agent_transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Clients can view their transactions"
  ON agent_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

-- Policies for agent_balances
CREATE POLICY "Agents can view their balance"
  ON agent_balances FOR SELECT
  TO authenticated
  USING (auth.uid() = agent_id);

CREATE POLICY "Agents can update their balance"
  ON agent_balances FOR UPDATE
  TO authenticated
  USING (auth.uid() = agent_id);

CREATE POLICY "Agents can insert their balance"
  ON agent_balances FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = agent_id);

-- Function to update agent balance
CREATE OR REPLACE FUNCTION update_agent_balance(
  agent_id uuid,
  commission_amount decimal
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO agent_balances (agent_id, balance, total_commissions, updated_at)
  VALUES (agent_id, commission_amount, commission_amount, now())
  ON CONFLICT (agent_id)
  DO UPDATE SET
    balance = agent_balances.balance + commission_amount,
    total_commissions = agent_balances.total_commissions + commission_amount,
    updated_at = now();
END;
$$;

-- Function to approve agent request
CREATE OR REPLACE FUNCTION approve_agent_request(request_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id_var uuid;
BEGIN
  -- Get user_id from request
  SELECT user_id INTO user_id_var
  FROM agent_requests
  WHERE id = request_id AND status = 'pending';
  
  IF user_id_var IS NULL THEN
    RAISE EXCEPTION 'Request not found or already processed';
  END IF;
  
  -- Update request status
  UPDATE agent_requests
  SET status = 'approved', updated_at = now()
  WHERE id = request_id;
  
  -- Update user profile
  UPDATE profiles
  SET agent_kalpe = true, updated_at = now()
  WHERE id = user_id_var;
  
  -- Initialize agent balance
  INSERT INTO agent_balances (agent_id, balance, total_commissions, updated_at)
  VALUES (user_id_var, 0, 0, now())
  ON CONFLICT (agent_id) DO NOTHING;
END;
$$;

-- Create storage bucket for agent documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('agent-documents', 'agent-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for agent documents
CREATE POLICY "Agents can upload documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'agent-documents');

CREATE POLICY "Agents can view their documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'agent-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_agent_requests_user_id ON agent_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_requests_status ON agent_requests(status);
CREATE INDEX IF NOT EXISTS idx_agent_transactions_agent_id ON agent_transactions(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_transactions_client_id ON agent_transactions(client_id);
CREATE INDEX IF NOT EXISTS idx_agent_transactions_date ON agent_transactions(date);
CREATE INDEX IF NOT EXISTS idx_profiles_agent_kalpe ON profiles(agent_kalpe);