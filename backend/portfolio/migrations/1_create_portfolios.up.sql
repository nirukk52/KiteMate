-- Create portfolios table with normalized holdings in JSONB
-- This is the single source of truth for all portfolio data (Constitution Principle II)

CREATE TABLE portfolios (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL CHECK (source IN ('zerodha', 'csv')),
  last_sync TIMESTAMPTZ NOT NULL,
  total_value NUMERIC(15, 2) NOT NULL CHECK (total_value >= 0),
  total_pnl NUMERIC(15, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for efficient queries
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_portfolios_source ON portfolios(source);
CREATE INDEX idx_portfolios_last_sync ON portfolios(last_sync);

-- GIN index for JSONB queries (searching within holdings)
CREATE INDEX idx_portfolios_data_gin ON portfolios USING GIN(data);

-- Comments for documentation
COMMENT ON TABLE portfolios IS 'Normalized portfolio data from all sources (Zerodha, CSV)';
COMMENT ON COLUMN portfolios.data IS 'Array of NormalizedHolding objects in JSONB format';
COMMENT ON COLUMN portfolios.source IS 'Data source: zerodha or csv';
COMMENT ON COLUMN portfolios.total_value IS 'Sum of all holding values (must be >= 0)';

