-- ============================================================================
-- FIX ROW-LEVEL SECURITY (RLS) POLICIES FOR SUPABASE
-- Run this in your Supabase SQL Editor to allow anon read and write access
-- ============================================================================

-- OPTION 1: Disable RLS completely on all transmission tables (Recommended for dashboard)
ALTER TABLE IF EXISTS substations DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS transmission_lines DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS transformers DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS observations DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS maintenance_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS outage_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS grid_alerts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notifications DISABLE ROW LEVEL SECURITY;

-- OPTION 2: If you prefer to keep RLS enabled, create permissive policies for anon & authenticated roles:
DROP POLICY IF EXISTS "Public full access to observations" ON observations;
CREATE POLICY "Public full access to observations" ON observations FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access to maintenance" ON maintenance_records;
CREATE POLICY "Public full access to maintenance" ON maintenance_records FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access to substations" ON substations;
CREATE POLICY "Public full access to substations" ON substations FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access to lines" ON transmission_lines;
CREATE POLICY "Public full access to lines" ON transmission_lines FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access to transformers" ON transformers;
CREATE POLICY "Public full access to transformers" ON transformers FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access to outage_events" ON outage_events;
CREATE POLICY "Public full access to outage_events" ON outage_events FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access to grid_alerts" ON grid_alerts;
CREATE POLICY "Public full access to grid_alerts" ON grid_alerts FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access to notifications" ON notifications;
CREATE POLICY "Public full access to notifications" ON notifications FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Grant schema table permissions to anon & authenticated roles
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
