-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create savings_accounts table
CREATE TABLE IF NOT EXISTS savings_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bank_name TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('digital', 'traditional')),
  balance NUMERIC(15, 2) NOT NULL DEFAULT 0,
  interest_rate NUMERIC(5, 2) NOT NULL DEFAULT 0,
  compounding TEXT NOT NULL CHECK (compounding IN ('monthly', 'quarterly', 'annually')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create stocks table
CREATE TABLE IF NOT EXISTS stocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  quantity NUMERIC(15, 4) NOT NULL DEFAULT 0,
  avg_price NUMERIC(15, 2) NOT NULL DEFAULT 0,
  current_price NUMERIC(15, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create time_deposits table
CREATE TABLE IF NOT EXISTS time_deposits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  principal NUMERIC(15, 2) NOT NULL DEFAULT 0,
  interest_rate NUMERIC(5, 2) NOT NULL DEFAULT 0,
  duration_months INTEGER NOT NULL DEFAULT 0,
  start_date DATE NOT NULL,
  tax_rate NUMERIC(5, 4) NOT NULL DEFAULT 0.02,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE savings_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_deposits ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for savings_accounts
CREATE POLICY "Users can view their own savings accounts"
  ON savings_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own savings accounts"
  ON savings_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own savings accounts"
  ON savings_accounts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own savings accounts"
  ON savings_accounts FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS Policies for stocks
CREATE POLICY "Users can view their own stocks"
  ON stocks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stocks"
  ON stocks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stocks"
  ON stocks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stocks"
  ON stocks FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS Policies for time_deposits
CREATE POLICY "Users can view their own time deposits"
  ON time_deposits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own time deposits"
  ON time_deposits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own time deposits"
  ON time_deposits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own time deposits"
  ON time_deposits FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_savings_accounts_user_id ON savings_accounts(user_id);
CREATE INDEX idx_stocks_user_id ON stocks(user_id);
CREATE INDEX idx_time_deposits_user_id ON time_deposits(user_id);
