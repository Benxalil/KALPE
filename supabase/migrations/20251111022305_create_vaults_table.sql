/*
  # Create Vaults Management System

  1. New Tables
    - `vaults`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text, vault name)
      - `purpose` (text, vault purpose/goal)
      - `balance` (numeric, current balance in vault)
      - `target_amount` (numeric, optional savings target)
      - `color` (text, color code for UI)
      - `icon` (text, icon identifier)
      - `is_locked` (boolean, whether vault is locked)
      - `pin` (text, encrypted PIN for vault)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `vault_transactions`
      - `id` (uuid, primary key)
      - `vault_id` (uuid, foreign key to vaults)
      - `type` (text, 'deposit' or 'withdrawal')
      - `amount` (numeric, transaction amount)
      - `description` (text, transaction description)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Users can only access their own vaults and transactions

  3. Important Notes
    - PIN is encrypted for security
    - Each vault can have a specific purpose/goal
    - Color and icon allow customization
    - Lock feature prevents accidental access/transfers
*/

CREATE TABLE IF NOT EXISTS vaults (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  purpose text NOT NULL,
  balance numeric DEFAULT 0 CHECK (balance >= 0),
  target_amount numeric,
  color text DEFAULT '#4f46e5',
  icon text DEFAULT 'piggy-bank',
  is_locked boolean DEFAULT false,
  pin text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_purpose CHECK (purpose IN ('savings', 'emergency', 'investment', 'education', 'holiday', 'custom'))
);

CREATE TABLE IF NOT EXISTS vault_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('deposit', 'withdrawal')),
  amount numeric NOT NULL CHECK (amount > 0),
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vaults ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own vaults"
  ON vaults FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create vaults"
  ON vaults FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vaults"
  ON vaults FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vaults"
  ON vaults FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own vault transactions"
  ON vault_transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vaults
      WHERE vaults.id = vault_transactions.vault_id
      AND vaults.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add transactions to their vaults"
  ON vault_transactions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vaults
      WHERE vaults.id = vault_id
      AND vaults.user_id = auth.uid()
    )
  );

CREATE INDEX idx_vaults_user_id ON vaults(user_id);
CREATE INDEX idx_vault_transactions_vault_id ON vault_transactions(vault_id);
