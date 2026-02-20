-- Create crypto table
CREATE TABLE IF NOT EXISTS crypto (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  quantity NUMERIC(15, 8) NOT NULL DEFAULT 0,
  avg_price NUMERIC(15, 2) NOT NULL DEFAULT 0,
  current_price NUMERIC(15, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create forex table
CREATE TABLE IF NOT EXISTS forex (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  quantity NUMERIC(15, 2) NOT NULL DEFAULT 0,
  avg_price NUMERIC(15, 4) NOT NULL DEFAULT 0,
  current_price NUMERIC(15, 4) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE crypto ENABLE ROW LEVEL SECURITY;
ALTER TABLE forex ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for crypto
CREATE POLICY "Users can view their own crypto"
  ON crypto FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own crypto"
  ON crypto FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own crypto"
  ON crypto FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own crypto"
  ON crypto FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS Policies for forex
CREATE POLICY "Users can view their own forex"
  ON forex FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own forex"
  ON forex FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own forex"
  ON forex FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own forex"
  ON forex FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_crypto_user_id ON crypto(user_id);
CREATE INDEX idx_forex_user_id ON forex(user_id);
