-- Enable RLS on all user tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drug_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_logs ENABLE ROW LEVEL SECURITY;

-- profiles: users manage own row only
CREATE POLICY "profiles_own" ON profiles
  FOR ALL USING (auth.uid()::text = id);

-- drug_bookmarks: users manage own bookmarks
CREATE POLICY "bookmarks_own" ON drug_bookmarks
  FOR ALL USING (auth.uid()::text = user_id);

-- prescriptions: users manage own prescriptions
CREATE POLICY "prescriptions_own" ON prescriptions
  FOR ALL USING (auth.uid()::text = user_id);

-- visit_logs: users manage own logs
CREATE POLICY "visit_logs_own" ON visit_logs
  FOR ALL USING (auth.uid()::text = user_id);
