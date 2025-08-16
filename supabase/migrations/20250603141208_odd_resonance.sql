/*
  # Agent Registration System

  1. New Tables
    - `agent_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `full_name` (text)
      - `phone` (text)
      - `location` (text)
      - `id_card_url` (text)
      - `shop_photo_url` (text)
      - `additional_docs` (jsonb)
      - `status` (enum: pending, approved, rejected)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `reviewed_at` (timestamp)
      - `reviewed_by` (uuid, references auth.users)
      - `rejection_reason` (text)

  2. Security
    - Enable RLS on `agent_requests` table
    - Add policies for users to view their own requests
    - Add policies for admins to view and manage all requests
*/

-- Create enum type for request status
CREATE TYPE agent_request_status AS ENUM ('pending', 'approved', 'rejected');

-- Create agent requests table
CREATE TABLE IF NOT EXISTS agent_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  location text NOT NULL,
  id_card_url text NOT NULL,
  shop_photo_url text NOT NULL,
  additional_docs jsonb DEFAULT '[]',
  status agent_request_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES auth.users,
  rejection_reason text,
  CONSTRAINT unique_pending_request UNIQUE (user_id, status)
);

-- Enable RLS
ALTER TABLE agent_requests ENABLE ROW LEVEL SECURITY;

-- Policies for users
CREATE POLICY "Users can view their own requests"
  ON agent_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own requests"
  ON agent_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for admins
CREATE POLICY "Admins can view all requests"
  ON agent_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update requests"
  ON agent_requests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'admin'
    )
  );