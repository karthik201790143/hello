-- ============================================================================
-- HVPNL TRANSMISSION DASHBOARD - SUPABASE COMPLETE SETUP SCRIPT
-- Paste this entire script into your Supabase SQL Editor and click "RUN"
-- ============================================================================

-- 1. CLEANUP PREVIOUS TABLES IF NEEDED
DROP VIEW IF EXISTS view_substation_summary CASCADE;
DROP VIEW IF EXISTS view_active_critical_issues CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS grid_alerts CASCADE;
DROP TABLE IF EXISTS outage_events CASCADE;
DROP TABLE IF EXISTS maintenance_records CASCADE;
DROP TABLE IF EXISTS observations CASCADE;
DROP TABLE IF EXISTS transformers CASCADE;
DROP TABLE IF EXISTS transmission_lines CASCADE;
DROP TABLE IF EXISTS substations CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. CREATE TABLES
CREATE TABLE substations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    circle TEXT NOT NULL,
    zone TEXT NOT NULL,
    division TEXT NOT NULL,
    voltage TEXT NOT NULL,
    "capacityMVA" NUMERIC NOT NULL DEFAULT 0,
    "peakLoadMW" NUMERIC NOT NULL DEFAULT 0,
    "currentLoadMW" NUMERIC NOT NULL DEFAULT 0,
    health TEXT NOT NULL DEFAULT 'Healthy',
    "transformersCount" INT NOT NULL DEFAULT 0,
    "linesCount" INT NOT NULL DEFAULT 0,
    "commissioningYear" INT,
    coordinates JSONB,
    "activeAlarms" INT NOT NULL DEFAULT 0,
    "lastMaintenance" TEXT,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE transmission_lines (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    "fromSubstation" TEXT NOT NULL,
    "toSubstation" TEXT NOT NULL,
    circle TEXT NOT NULL,
    zone TEXT NOT NULL,
    voltage TEXT NOT NULL,
    "lengthKm" NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'In Service',
    "loadingPct" NUMERIC NOT NULL DEFAULT 0,
    "currentFlowMW" NUMERIC NOT NULL DEFAULT 0,
    "capacityMW" NUMERIC NOT NULL DEFAULT 0,
    "trippingCount" INT NOT NULL DEFAULT 0,
    "lastPatrolled" TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE transformers (
    id TEXT PRIMARY KEY,
    "substationId" TEXT NOT NULL,
    "substationName" TEXT NOT NULL,
    name TEXT NOT NULL,
    circle TEXT NOT NULL,
    zone TEXT NOT NULL,
    voltage TEXT NOT NULL,
    "capacityMVA" NUMERIC NOT NULL,
    "loadingPct" NUMERIC NOT NULL DEFAULT 0,
    "currentLoadMVA" NUMERIC NOT NULL DEFAULT 0,
    "oilTemperatureC" NUMERIC NOT NULL DEFAULT 0,
    "windingTemperatureC" NUMERIC NOT NULL DEFAULT 0,
    "healthStatus" TEXT NOT NULL DEFAULT 'Healthy',
    "dgaStatus" TEXT NOT NULL DEFAULT 'Normal',
    make TEXT,
    "yearOfMfg" INT,
    "lastTested" TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE observations (
    id TEXT PRIMARY KEY,
    "observationNo" TEXT UNIQUE NOT NULL,
    substation TEXT NOT NULL,
    circle TEXT NOT NULL,
    zone TEXT NOT NULL,
    voltage TEXT NOT NULL,
    equipment TEXT NOT NULL,
    "equipmentType" TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    "reportedDate" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    "daysPending" INT DEFAULT 0,
    "inspectorName" TEXT NOT NULL,
    "assignedEngineer" TEXT NOT NULL,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE maintenance_records (
    id TEXT PRIMARY KEY,
    "assetType" TEXT NOT NULL,
    "assetName" TEXT NOT NULL,
    substation TEXT NOT NULL,
    circle TEXT NOT NULL,
    zone TEXT NOT NULL,
    cycle TEXT NOT NULL,
    "financialYear" TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    "dueDate" TEXT NOT NULL,
    "completionDate" TEXT,
    "engineerInCharge" TEXT NOT NULL,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE outage_events (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    "assetName" TEXT NOT NULL,
    "assetType" TEXT NOT NULL,
    voltage TEXT NOT NULL,
    circle TEXT NOT NULL,
    "outageType" TEXT NOT NULL,
    cause TEXT NOT NULL,
    "relayOperated" TEXT,
    "loadLossMW" NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Tripped',
    "durationMinutes" INT NOT NULL DEFAULT 0,
    "restorationTime" TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE grid_alerts (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    severity TEXT NOT NULL,
    substation TEXT NOT NULL,
    equipment TEXT,
    acknowledged BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notifications (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ENABLE ROW LEVEL SECURITY AND PERMISSIVE POLICIES FOR SUPABASE ANON KEY
ALTER TABLE substations ENABLE ROW LEVEL SECURITY;
ALTER TABLE transmission_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE transformers ENABLE ROW LEVEL SECURITY;
ALTER TABLE observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE outage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE grid_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write on substations" ON substations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on transmission_lines" ON transmission_lines FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on transformers" ON transformers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on observations" ON observations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on maintenance_records" ON maintenance_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on outage_events" ON outage_events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on grid_alerts" ON grid_alerts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on notifications" ON notifications FOR ALL USING (true) WITH CHECK (true);

-- 4. SEED INITIAL DATA
INSERT INTO substations (id, name, code, circle, zone, division, voltage, "capacityMVA", "peakLoadMW", "currentLoadMW", health, "transformersCount", "linesCount", "commissioningYear", coordinates, "activeAlarms", "lastMaintenance", address) VALUES
('SS-400-01', '400kV Bawal', 'BWL-400', 'Rewari Circle', 'South Zone', 'Division I', '400kV', 1000, 620, 512, 'Critical', 4, 8, 2012, '{"x": 38, "y": 84, "lat": 28.08, "lng": 76.58}', 3, '2026-04-10', 'Sector 8, Industrial Estate, Bawal, Rewari, Haryana'),
('SS-400-02', '400kV Daultabad (Gurugram)', 'DLT-400', 'Gurugram Circle', 'South Zone', 'Division I', '400kV', 1260, 840, 710, 'Healthy', 5, 10, 2009, '{"x": 62, "y": 78, "lat": 28.48, "lng": 77.01}', 0, '2026-05-02', 'Sector 104, Near Dwarka Expressway, Gurugram, Haryana'),
('SS-400-03', '400kV Kirori (Hisar)', 'KRR-400', 'Hisar Circle', 'Central Zone', 'Division II', '400kV', 945, 580, 495, 'Healthy', 3, 6, 2015, '{"x": 22, "y": 52, "lat": 29.15, "lng": 75.72}', 0, '2026-03-22', 'Kirori Sub-Station, Bypass Road, Hisar, Haryana'),
('SS-220-01', '220kV Panipat BBMB/HVPNL', 'PNP-220', 'Panipat Circle', 'North Zone', 'Division I', '220kV', 640, 420, 375, 'Critical', 4, 8, 2004, '{"x": 60, "y": 35, "lat": 29.39, "lng": 76.97}', 4, '2026-02-18', 'Thermal Power Station Road, Panipat, Haryana'),
('SS-220-02', '220kV Rohtak Bypass', 'RTK-220', 'Rohtak Circle', 'Central Zone', 'Division I', '220kV', 480, 310, 265, 'Moderate', 3, 6, 2011, '{"x": 48, "y": 62, "lat": 28.89, "lng": 76.61}', 2, '2026-04-28', 'Outer Ring Road, Near PGIMS, Rohtak, Haryana'),
('SS-220-03', '220kV Karnal Sector 32', 'KRL-220', 'Karnal Circle', 'North Zone', 'Division II', '220kV', 500, 320, 280, 'Healthy', 3, 5, 2016, '{"x": 68, "y": 28, "lat": 29.69, "lng": 76.98}', 0, '2026-05-12', 'Sector 32 Urban Estate, Karnal, Haryana'),
('SS-220-04', '220kV Ambala City', 'AMB-220', 'Ambala Circle', 'North Zone', 'Division I', '220kV', 460, 290, 240, 'Healthy', 3, 6, 2008, '{"x": 38, "y": 15, "lat": 30.37, "lng": 76.78}', 0, '2026-05-01', 'Baldev Nagar, GT Road, Ambala City, Haryana'),
('SS-132-01', '132kV Kaithal', 'KTH-132', 'Karnal Circle', 'North Zone', 'Division III', '132kV', 240, 160, 135, 'Moderate', 2, 4, 2013, '{"x": 44, "y": 30, "lat": 29.80, "lng": 76.40}', 1, '2026-04-15', 'Jind Road, Kaithal, Haryana'),
('SS-132-02', '132kV Jind Industrial Area', 'JND-132', 'Jind Circle', 'Central Zone', 'Division I', '132kV', 200, 145, 118, 'Healthy', 2, 4, 2010, '{"x": 46, "y": 44, "lat": 29.32, "lng": 76.31}', 0, '2026-05-08', 'Industrial Area, Hansi Road, Jind, Haryana'),
('SS-132-03', '132kV Yamunanagar Jagadhri', 'YNR-132', 'Yamunanagar Circle', 'North Zone', 'Division I', '132kV', 280, 195, 172, 'Healthy', 3, 5, 2014, '{"x": 58, "y": 12, "lat": 30.13, "lng": 77.29}', 0, '2026-04-20', 'Workshop Road, Yamunanagar, Haryana'),
('SS-132-04', '132kV Faridabad Sector 25', 'FBD-132', 'Faridabad Circle', 'South Zone', 'Division II', '132kV', 320, 240, 215, 'Outage', 3, 6, 2006, '{"x": 74, "y": 82, "lat": 28.36, "lng": 77.31}', 5, '2026-01-25', 'Sector 25, Ballabgarh Industrial Area, Faridabad, Haryana'),
('SS-66-01', '66kV Narwana', 'NRW-66', 'Jind Circle', 'Central Zone', 'Division II', '66kV', 100, 68, 58, 'Critical', 2, 3, 2017, '{"x": 38, "y": 40, "lat": 29.60, "lng": 76.12}', 2, '2026-03-05', 'Near Railway Crossing, Narwana, Jind, Haryana'),
('SS-66-02', '66kV Panchkula Sector 12', 'PKL-66', 'Ambala Circle', 'North Zone', 'Division II', '66kV', 120, 82, 74, 'Healthy', 2, 4, 2018, '{"x": 55, "y": 6, "lat": 30.69, "lng": 76.86}', 0, '2026-05-14', 'Sector 12-A, Urban Estate, Panchkula, Haryana');

INSERT INTO transmission_lines (id, name, code, "fromSubstation", "toSubstation", circle, zone, voltage, "lengthKm", status, "loadingPct", "currentFlowMW", "capacityMW", "trippingCount", "lastPatrolled") VALUES
('TL-400-01', '400kV D/C Bawal – Daultabad (Gurugram)', 'BWL-DLT-400', '400kV Bawal', '400kV Daultabad', 'Gurugram Circle', 'South Zone', '400kV', 68.4, 'In Service', 68.2, 485, 710, 1, '2026-05-10'),
('TL-400-02', '400kV D/C Kirori (Hisar) – Bhiwani', 'KRR-BHW-400', '400kV Kirori (Hisar)', '400kV Kirori (Hisar)', 'Hisar Circle', 'Central Zone', '400kV', 76.2, 'In Service', 74.5, 520, 700, 0, '2026-05-08'),
('TL-220-01', '220kV D/C Rohtak Bypass – Panipat BBMB', 'RTK-PNP-220', '220kV Rohtak Bypass', '220kV Panipat BBMB/HVPNL', 'Rohtak Circle', 'Central Zone', '220kV', 71.0, 'Tripped', 0, 0, 280, 5, '2026-05-15'),
('TL-220-02', '220kV D/C Karnal – Kaithal', 'KRL-KTH-220', '220kV Karnal Sector 32', '132kV Kaithal', 'Karnal Circle', 'North Zone', '220kV', 62.5, 'In Service', 82.4, 230, 280, 2, '2026-05-01'),
('TL-132-01', '132kV S/C Ambala City – Panchkula', 'AMB-PKL-132', '220kV Ambala City', '66kV Panchkula Sector 12', 'Ambala Circle', 'North Zone', '132kV', 42.8, 'In Service', 61.5, 74, 120, 0, '2026-05-12'),
('TL-66-01', '66kV D/C Narwana – Kalayat', 'NRW-KLY-66', '66kV Narwana', '132kV Jind Industrial Area', 'Jind Circle', 'Central Zone', '66kV', 28.5, 'Under Maintenance', 0, 0, 45, 3, '2026-05-17');

INSERT INTO transformers (id, "substationId", "substationName", name, circle, zone, voltage, "capacityMVA", "loadingPct", "currentLoadMVA", "oilTemperatureC", "windingTemperatureC", "healthStatus", "dgaStatus", make, "yearOfMfg", "lastTested") VALUES
('TR-400-01', 'SS-400-01', '400kV Bawal', '315 MVA ICT-1', 'Rewari Circle', 'South Zone', '400/220kV', 315, 88.5, 278.8, 72, 84, 'Critical', 'Warning', 'BHEL', 2012, '2026-04-12'),
('TR-400-02', 'SS-400-02', '400kV Daultabad (Gurugram)', '315 MVA ICT-2', 'Gurugram Circle', 'South Zone', '400/220kV', 315, 62.1, 195.6, 54, 61, 'Healthy', 'Normal', 'ABB', 2018, '2026-05-02'),
('TR-220-01', 'SS-220-01', '220kV Panipat BBMB/HVPNL', '160 MVA PTR-1', 'Panipat Circle', 'North Zone', '220/66kV', 160, 94.2, 150.7, 78, 91, 'Critical', 'Critical', 'Crompton Greaves', 2004, '2026-03-20'),
('TR-220-02', 'SS-220-02', '220kV Rohtak Bypass', '100 MVA PTR-2', 'Rohtak Circle', 'Central Zone', '220/132kV', 100, 76.4, 76.4, 59, 68, 'Moderate', 'Caution', 'Siemens', 2011, '2026-04-28'),
('TR-132-01', 'SS-132-01', '132kV Kaithal', '50 MVA PTR-1', 'Karnal Circle', 'North Zone', '132/33kV', 50, 56.0, 28.0, 48, 54, 'Healthy', 'Normal', 'Schneider Electric', 2016, '2026-04-15'),
('TR-132-02', 'SS-132-04', '132kV Faridabad Sector 25', '50 MVA PTR-2', 'Faridabad Circle', 'South Zone', '132/33kV', 50, 104.5, 52.2, 86, 101, 'Outage', 'Critical', 'Voltamp', 2006, '2026-01-25');

INSERT INTO observations (id, "observationNo", substation, circle, zone, voltage, equipment, "equipmentType", description, severity, status, "reportedDate", "dueDate", "daysPending", "inspectorName", "assignedEngineer", remarks) VALUES
('OBS-001', 'MP-BWL-2026-089', '400kV Bawal', 'Gurugram Circle', 'South Zone', '400kV', 'Power Transformer-1', 'Transformer', 'Oil leakage observed from conservator tank flange gasket & OLTC inspection glass blurred', 'Critical', 'Critical Pending', '2026-04-02', '2026-04-17', 45, 'Er. R. K. Sharma (XEN M&P)', 'Er. Amit Verma (SDO TS)', 'Gasket replacement kit indented from Central Stores. Scheduled for upcoming planned shutdown.'),
('OBS-002', 'MP-PNP-2026-114', '220kV Panipat BBMB/HVPNL', 'Panipat Circle', 'North Zone', '220kV', 'ICT-1 160MVA', 'Transformer', 'Buchholz relay trip contact found sluggish during secondary injection test; oil sample shows high acetylene (C2H2 = 18 ppm)', 'Critical', 'Critical Pending', '2026-03-18', '2026-04-02', 60, 'Er. S. S. Malik (SE M&P)', 'Er. Vikas Dahiya (SDO Maint)', 'Immediate DGA re-test recommended. D-energization requested from SLDC.'),
('OBS-003', 'MP-KTH-2026-042', '132kV Kaithal', 'Karnal Circle', 'North Zone', '132kV', '132kV Circuit Breaker (CB-102)', 'Circuit Breaker', 'Spring charging motor defective; manual charging being used during emergency operations', 'Critical', 'Critical Pending', '2026-04-20', '2026-05-05', 27, 'Er. Anil Gupta (AE M&P)', 'Er. Sandeep Rana (JE-1)', 'Replacement 220V DC motor procured; installation pending PTW approval.'),
('OBS-004', 'MP-NRW-2026-078', '66kV Narwana', 'Jind Circle', 'Central Zone', '66kV', '66kV Bus Isolator ISO-601', 'Isolator', 'Contact wear & severe thermal heating (Delta T > 45°C) observed under thermography camera', 'Critical', 'Critical Pending', '2026-05-01', '2026-05-15', 16, 'Er. Dinesh Kumar (SDO M&P)', 'Er. Rajesh Hooda (SDO TS)', 'Isolator jaw contacts polished temporarily; complete assembly replacement advised.'),
('OBS-005', 'MP-RTK-2026-105', '220kV Rohtak Bypass', 'Rohtak Circle', 'Central Zone', '220kV', 'PLCC Wave Trap WT-201', 'Wave Trap', 'High VSWR (> 2.8) observed; carrier communication link dropping intermittent carrier signal', 'Critical', 'Critical Pending', '2026-04-14', '2026-04-29', 33, 'Er. M. P. Singh (XEN Comm)', 'Er. Gaurav Chawla (SDO Comm)', 'Line matching unit (LMU) tuning unit capacitor adjusted; fine tuning underway.'),
('OBS-006', 'MP-GGM-2026-152', '400kV Daultabad (Gurugram)', 'Gurugram Circle', 'South Zone', '400kV', 'Differential Relay (87T)', 'Relay', 'Numerical relay firmware update pending; self-supervision watchdog LED intermittent', 'Moderate', 'Pending', '2026-05-05', '2026-05-25', 12, 'Er. R. K. Sharma (XEN M&P)', 'Er. Tarun Sethi (AE M&P)', 'OEM support engineer scheduled for site visit on Monday.'),
('OBS-007', 'MP-AMB-2026-031', '220kV Ambala City', 'Ambala Circle', 'North Zone', '220kV', 'Station Battery Bank (220V DC)', 'Battery Bank', 'Cell #14 & #38 specific gravity below 1.180; individual boost charger required', 'Moderate', 'Closed', '2026-03-10', '2026-03-25', 0, 'Er. Anil Gupta (AE M&P)', 'Er. Naresh Pal (JE DC)', 'Electrolyte topped up and boost equalization cycle executed successfully. Closed.'),
('OBS-008', 'MP-FBD-2026-210', '132kV Faridabad Sector 25', 'Faridabad Circle', 'South Zone', '132kV', 'Current Transformer (CT) R-Phase', 'CT/PT', 'Tan delta value increased to 0.0082 (Threshold < 0.005); dielectric dissipation test failure', 'Critical', 'Critical Pending', '2026-04-18', '2026-05-02', 29, 'Er. S. S. Malik (SE M&P)', 'Er. Pankaj Garg (SDO TS)', 'Spare 132kV CT mobilized from Ballabgarh store.');

INSERT INTO maintenance_records (id, "assetType", "assetName", substation, circle, zone, cycle, "financialYear", status, "dueDate", "completionDate", "engineerInCharge", remarks) VALUES
('MNT-001', 'Transformer', '315 MVA ICT-1 Bawal', '400kV Bawal', 'Rewari Circle', 'South Zone', 'Annual', '2026-27', 'Overdue', '2026-04-15', NULL, 'Er. Amit Verma', 'DGA testing, oil filtration, and OLTC mechanism servicing overdue by 32 days'),
('MNT-002', 'Substation', '220kV Switchyard Rohtak', '220kV Rohtak Bypass', 'Rohtak Circle', 'Central Zone', 'Half Yearly', '2026-27', 'Done', '2026-05-01', '2026-04-28', 'Er. Rajesh Hooda', 'Busbar insulator washing, earth pit resistance testing (< 0.5 ohm verified)'),
('MNT-003', 'Transmission Line', '400kV Bawal-Daultabad Line', '400kV Bawal', 'Gurugram Circle', 'South Zone', 'Quarterly', '2026-27', 'Done', '2026-05-15', '2026-05-10', 'Er. Tarun Sethi', 'Tower footing resistance check, drone thermography of span joints completed'),
('MNT-004', 'Circuit Breaker', '220kV SF6 Breaker CB-201', '220kV Panipat BBMB/HVPNL', 'Panipat Circle', 'North Zone', 'Monthly', '2026-27', 'Pending', '2026-05-28', NULL, 'Er. Vikas Dahiya', 'SF6 gas pressure logging, dew point measurement, timing test scheduled'),
('MNT-005', 'Protection Scheme', 'Numerical Busbar Protection Scheme', '400kV Daultabad (Gurugram)', 'Gurugram Circle', 'South Zone', 'Annual', '2026-27', 'Done', '2026-05-10', '2026-05-02', 'Er. R. K. Sharma', 'Secondary injection testing of all central and bay units passed 100%');

INSERT INTO outage_events (id, timestamp, "assetName", "assetType", voltage, circle, "outageType", cause, "relayOperated", "loadLossMW", status, "durationMinutes", "restorationTime") VALUES
('EVT-2026-058', '2026-05-20 09:14 AM', '220kV Rohtak-Panipat Ckt-1', 'Transmission Line', '220kV', 'Rohtak Circle', 'Forced', 'Heavy storm & tree branch fallen on conductor near Gohana tower #84', 'Distance Relay (Zone 1 - 24.6 km, R-N Fault)', 140, 'Tripped', 76, NULL),
('EVT-2026-057', '2026-05-19 02:40 PM', '50 MVA PTR-2 Faridabad', 'Transformer', '132kV', 'Faridabad Circle', 'Forced', 'Differential relay trip (87T) due to internal winding inter-turn flashover', 'Master Trip Relay (86A) + Differential (87T)', 45, 'Under Restoration', 1320, NULL),
('EVT-2026-056', '2026-05-18 06:00 AM', '400kV Kirori Bay-4 CB', 'Substation Bus', '400kV', 'Hisar Circle', 'Planned', 'Scheduled annual overhaul and contact resistance measurement by OEM', 'N/A (Planned Shutdown)', 0, 'Restored', 360, '2026-05-18 12:00 PM');

INSERT INTO grid_alerts (id, timestamp, title, message, severity, substation, equipment, acknowledged) VALUES
('ALT-01', '10 mins ago', 'Critical Tripping Alert: 220kV Rohtak-Panipat Ckt-1', 'Tripped on Zone-1 Distance Protection (R-N Fault, 24.6km). SLDC notified for alternative route.', 'critical', '220kV Rohtak Bypass', 'Transmission Line Ckt-1', FALSE),
('ALT-02', '25 mins ago', 'Transformer High Temp Alarm: 315 MVA ICT-1 Bawal', 'Winding Temperature exceeded threshold: 84°C (Warning limit 80°C). Forced cooling bank-2 auto-started.', 'warning', '400kV Bawal', 'ICT-1 315MVA', FALSE),
('ALT-03', '1 hour ago', 'Overdue M&P Observation: Buchholz Relay Test', 'Observation MP-PNP-2026-114 has been pending for 60 days. Immediate executive intervention required.', 'critical', '220kV Panipat BBMB/HVPNL', 'ICT-1 160MVA', TRUE),
('ALT-04', '2 hours ago', 'SF6 Low Gas Pressure Warning (Stage 1)', '66kV Narwana CB-602 SF6 gas pressure dropped to 5.2 bar (Rated 6.0 bar).', 'warning', '66kV Narwana', 'CB-602', TRUE),
('ALT-05', '3 hours ago', 'Grid Frequency Stabilized within IEGC Band', 'System frequency sustained at 50.02 Hz across all Haryana transmission nodes.', 'info', 'State Load Despatch Centre (SLDC Sewah)', NULL, TRUE);

INSERT INTO notifications (id, timestamp, title, message, type, read) VALUES
('NOTIF-01', '15 mins ago', 'Annual Maintenance Schedule FY 2026-27 Approved', 'Chief Engineer (TS) has approved the Q2 preventive maintenance schedule for North Zone.', 'maintenance', FALSE),
('NOTIF-02', '45 mins ago', 'M&P Audit Report Uploaded: Gurugram Circle', 'Inspection report containing 42 observations uploaded by XEN M&P Gurugram.', 'audit', FALSE),
('NOTIF-03', '2 hours ago', 'Weather Warning: Thunderstorm & High Winds', 'IMD Alert: Squall wind speeds up to 65 km/h predicted in Ambala, Yamunanagar, Karnal circles.', 'weather', FALSE),
('NOTIF-04', '5 hours ago', 'SCADA Telemetry System Health Check Complete', 'All 178 RTUs reporting RTU data latency < 800ms to SLDC servers.', 'system', TRUE),
('NOTIF-05', '1 day ago', 'Monthly Energy Accounting (April 2026) Published', 'Total Energy wheeled across Haryana transmission network: 2,845.2 MU (Transmission Loss: 1.42%).', 'system', TRUE);
