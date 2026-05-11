CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS drug_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  drug_id INTEGER NOT NULL,
  brand_name TEXT,
  generic_name TEXT,
  strength TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, drug_id)
);

CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  patient_name TEXT,
  patient_age TEXT,
  patient_sex TEXT,
  diagnosis TEXT,
  drugs JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS visit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  clinic_name TEXT NOT NULL,
  clinic_color TEXT DEFAULT '#C8F53C',
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  patient_count INTEGER DEFAULT 0,
  earnings_bdt NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
