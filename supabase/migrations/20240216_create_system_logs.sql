
CREATE TABLE IF NOT EXISTS system_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  level TEXT NOT NULL,
  event TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on timestamp for better query performance
CREATE INDEX IF NOT EXISTS idx_system_logs_timestamp ON system_logs(timestamp);

-- Create a policy to allow inserting logs
CREATE POLICY "Allow inserting logs"
  ON system_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Enable RLS
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
