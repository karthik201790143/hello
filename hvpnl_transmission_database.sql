-- ============================================================================
-- HVPNL TRANSMISSION DASHBOARD - COMPLETE DATABASE SCRIPT (PostgreSQL)
-- File: hvpnl_transmission_database.sql
-- Description: Full schema definitions, constraints, indexes, views, and seed data.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. DROP EXISTING TABLES AND TYPES (FOR CLEAN INITIALIZATION)
-- ----------------------------------------------------------------------------
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

DROP TYPE IF EXISTS voltage_level CASCADE;
DROP TYPE IF EXISTS asset_health CASCADE;
DROP TYPE IF EXISTS observation_status CASCADE;
DROP TYPE IF EXISTS observation_severity CASCADE;
DROP TYPE IF EXISTS equipment_type CASCADE;
DROP TYPE IF EXISTS maintenance_cycle_type CASCADE;
DROP TYPE IF EXISTS maintenance_status CASCADE;
DROP TYPE IF EXISTS line_status CASCADE;
DROP TYPE IF EXISTS dga_status CASCADE;
DROP TYPE IF EXISTS outage_type CASCADE;
DROP TYPE IF EXISTS outage_status CASCADE;
DROP TYPE IF EXISTS alert_severity CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- ----------------------------------------------------------------------------
-- 2. ENUM TYPES
-- ----------------------------------------------------------------------------
CREATE TYPE voltage_level AS ENUM ('400kV', '220kV', '132kV', '66kV');
CREATE TYPE asset_health AS ENUM ('Healthy', 'Moderate', 'Critical', 'Outage');
CREATE TYPE observation_status AS ENUM ('Critical Pending', 'Pending', 'Closed', 'Under Rectification');
CREATE TYPE observation_severity AS ENUM ('Critical', 'Moderate', 'Low');
CREATE TYPE equipment_type AS ENUM ('Transformer', 'Circuit Breaker', 'Isolator', 'Wave Trap', 'CT/PT', 'Relay', 'Battery Bank', 'Busbar');
CREATE TYPE maintenance_cycle_type AS ENUM ('Annual', 'Half Yearly', 'Quarterly', 'Monthly');
CREATE TYPE maintenance_status AS ENUM ('Done', 'Pending', 'Overdue');
CREATE TYPE line_status AS ENUM ('In Service', 'Under Maintenance', 'Tripped');
CREATE TYPE dga_status AS ENUM ('Normal', 'Caution', 'Warning', 'Critical');
CREATE TYPE outage_type AS ENUM ('Forced', 'Planned', 'Emergency');
CREATE TYPE outage_status AS ENUM ('Tripped', 'Under Restoration', 'Restored');
CREATE TYPE alert_severity AS ENUM ('critical', 'warning', 'info');
CREATE TYPE notification_type AS ENUM ('maintenance', 'audit', 'system', 'weather');
CREATE TYPE user_role AS ENUM ('ADMIN', 'CIRCLE_ENGINEER', 'INSPECTOR', 'VIEWER');

-- ----------------------------------------------------------------------------
-- 3. USERS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'VIEWER',
    circle VARCHAR(50),
    zone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 4. SUBSTATIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE substations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(30) UNIQUE NOT NULL,
    circle VARCHAR(50) NOT NULL,
    zone VARCHAR(50) NOT NULL,
    division VARCHAR(50) NOT NULL,
    voltage voltage_level NOT NULL,
    capacity_mva NUMERIC(10, 2) NOT NULL DEFAULT 0,
    peak_load_mw NUMERIC(10, 2) NOT NULL DEFAULT 0,
    current_load_mw NUMERIC(10, 2) NOT NULL DEFAULT 0,
    health asset_health NOT NULL DEFAULT 'Healthy',
    transformers_count INT NOT NULL DEFAULT 0,
    lines_count INT NOT NULL DEFAULT 0,
    commissioning_year INT,
    coord_x NUMERIC(6, 2),
    coord_y NUMERIC(6, 2),
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    active_alarms INT NOT NULL DEFAULT 0,
    last_maintenance DATE,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 5. TRANSMISSION LINES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE transmission_lines (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    from_substation VARCHAR(150) NOT NULL,
    to_substation VARCHAR(150) NOT NULL,
    circle VARCHAR(50) NOT NULL,
    zone VARCHAR(50) NOT NULL,
    voltage voltage_level NOT NULL,
    length_km NUMERIC(8, 2) NOT NULL,
    status line_status NOT NULL DEFAULT 'In Service',
    loading_pct NUMERIC(5, 2) NOT NULL DEFAULT 0,
    current_flow_mw NUMERIC(10, 2) NOT NULL DEFAULT 0,
    capacity_mw NUMERIC(10, 2) NOT NULL DEFAULT 0,
    tripping_count INT NOT NULL DEFAULT 0,
    last_patrolled DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 6. TRANSFORMERS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE transformers (
    id VARCHAR(50) PRIMARY KEY,
    substation_id VARCHAR(50) NOT NULL REFERENCES substations(id) ON DELETE CASCADE,
    substation_name VARCHAR(150) NOT NULL,
    name VARCHAR(100) NOT NULL,
    circle VARCHAR(50) NOT NULL,
    zone VARCHAR(50) NOT NULL,
    voltage VARCHAR(50) NOT NULL,
    capacity_mva NUMERIC(10, 2) NOT NULL,
    loading_pct NUMERIC(5, 2) NOT NULL DEFAULT 0,
    current_load_mva NUMERIC(10, 2) NOT NULL DEFAULT 0,
    oil_temperature_c NUMERIC(5, 2) NOT NULL DEFAULT 0,
    winding_temperature_c NUMERIC(5, 2) NOT NULL DEFAULT 0,
    health_status asset_health NOT NULL DEFAULT 'Healthy',
    dga_status dga_status NOT NULL DEFAULT 'Normal',
    make VARCHAR(100),
    year_of_mfg INT,
    last_tested DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 7. OBSERVATIONS TABLE (M&P Audits & Defects)
-- ----------------------------------------------------------------------------
CREATE TABLE observations (
    id VARCHAR(50) PRIMARY KEY,
    observation_no VARCHAR(50) UNIQUE NOT NULL,
    substation VARCHAR(150) NOT NULL,
    circle VARCHAR(50) NOT NULL,
    zone VARCHAR(50) NOT NULL,
    voltage voltage_level NOT NULL,
    equipment VARCHAR(100) NOT NULL,
    equipment_type equipment_type NOT NULL,
    description TEXT NOT NULL,
    severity observation_severity NOT NULL,
    status observation_status NOT NULL DEFAULT 'Pending',
    reported_date DATE NOT NULL,
    due_date DATE NOT NULL,
    days_pending INT DEFAULT 0,
    inspector_name VARCHAR(100) NOT NULL,
    assigned_engineer VARCHAR(100) NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 8. MAINTENANCE RECORDS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE maintenance_records (
    id VARCHAR(50) PRIMARY KEY,
    asset_type VARCHAR(50) NOT NULL,
    asset_name VARCHAR(150) NOT NULL,
    substation VARCHAR(150) NOT NULL,
    circle VARCHAR(50) NOT NULL,
    zone VARCHAR(50) NOT NULL,
    cycle maintenance_cycle_type NOT NULL,
    financial_year VARCHAR(20) NOT NULL,
    status maintenance_status NOT NULL DEFAULT 'Pending',
    due_date DATE NOT NULL,
    completion_date DATE,
    engineer_in_charge VARCHAR(100) NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 9. OUTAGE EVENTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE outage_events (
    id VARCHAR(50) PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    asset_name VARCHAR(150) NOT NULL,
    asset_type VARCHAR(50) NOT NULL,
    voltage voltage_level NOT NULL,
    circle VARCHAR(50) NOT NULL,
    outage_type outage_type NOT NULL,
    cause TEXT NOT NULL,
    relay_operated VARCHAR(100),
    load_loss_mw NUMERIC(10, 2) NOT NULL DEFAULT 0,
    status outage_status NOT NULL DEFAULT 'Tripped',
    duration_minutes INT NOT NULL DEFAULT 0,
    restoration_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 10. GRID ALERTS & NOTIFICATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE grid_alerts (
    id VARCHAR(50) PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    severity alert_severity NOT NULL,
    substation VARCHAR(150) NOT NULL,
    equipment VARCHAR(100),
    acknowledged BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id VARCHAR(50) PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 11. INDEXES FOR HIGH-PERFORMANCE DASHBOARD QUERIES
-- ----------------------------------------------------------------------------
CREATE INDEX idx_substations_zone_circle ON substations(zone, circle);
CREATE INDEX idx_substations_voltage ON substations(voltage);
CREATE INDEX idx_substations_health ON substations(health);
CREATE INDEX idx_transformers_substation ON transformers(substation_id);
CREATE INDEX idx_lines_status ON transmission_lines(status);
CREATE INDEX idx_obs_status_severity ON observations(status, severity);
CREATE INDEX idx_maintenance_fy_status ON maintenance_records(financial_year, status);
CREATE INDEX idx_outages_timestamp ON outage_events(timestamp DESC);
CREATE INDEX idx_alerts_unack ON grid_alerts(acknowledged) WHERE acknowledged = FALSE;

-- ----------------------------------------------------------------------------
-- 12. HELPER VIEWS FOR ANALYTICS & KPIS
-- ----------------------------------------------------------------------------
CREATE VIEW view_substation_summary AS
SELECT 
    zone,
    circle,
    voltage,
    COUNT(*) AS total_substations,
    SUM(capacity_mva) AS total_capacity_mva,
    SUM(current_load_mw) AS total_current_load_mw,
    SUM(peak_load_mw) AS total_peak_load_mw,
    COUNT(*) FILTER (WHERE health = 'Critical') AS critical_substations,
    COUNT(*) FILTER (WHERE health = 'Outage') AS outage_substations,
    SUM(active_alarms) AS total_active_alarms
FROM substations
GROUP BY zone, circle, voltage;

CREATE VIEW view_active_critical_issues AS
SELECT 
    'Observation' AS issue_type,
    id,
    substation,
    equipment,
    description,
    reported_date AS date_reported,
    severity::text AS severity_level
FROM observations
WHERE status IN ('Critical Pending', 'Pending') AND severity = 'Critical'
UNION ALL
SELECT 
    'Outage' AS issue_type,
    id,
    circle AS substation,
    asset_name AS equipment,
    cause AS description,
    timestamp::date AS date_reported,
    'Critical' AS severity_level
FROM outage_events
WHERE status != 'Restored';

-- ----------------------------------------------------------------------------
-- 13. SEED DATA (INITIAL DATA LOAD)
-- ----------------------------------------------------------------------------

-- Substations
INSERT INTO substations (id, name, code, circle, zone, division, voltage, capacity_mva, peak_load_mw, current_load_mw, health, transformers_count, lines_count, commissioning_year, coord_x, coord_y, latitude, longitude, active_alarms, last_maintenance, address) VALUES
('SS-400-01', '400kV Bawal', 'BWL-400', 'Rewari Circle', 'South Zone', 'Division I', '400kV', 1000, 620, 512, 'Critical', 4, 8, 2012, 38, 84, 28.08, 76.58, 3, '2026-04-10', 'Sector 8, Industrial Estate, Bawal, Rewari, Haryana'),
('SS-400-02', '400kV Daultabad (Gurugram)', 'DLT-400', 'Gurugram Circle', 'South Zone', 'Division I', '400kV', 1260, 840, 710, 'Healthy', 5, 10, 2009, 62, 78, 28.48, 77.01, 0, '2026-05-02', 'Sector 104, Near Dwarka Expressway, Gurugram, Haryana'),
('SS-400-03', '400kV Kirori (Hisar)', 'KRR-400', 'Hisar Circle', 'Central Zone', 'Division II', '400kV', 945, 580, 495, 'Healthy', 3, 6, 2015, 22, 52, 29.15, 75.72, 0, '2026-03-22', 'Kirori Sub-Station, Bypass Road, Hisar, Haryana'),
('SS-220-01', '220kV Panipat BBMB/HVPNL', 'PNP-220', 'Panipat Circle', 'North Zone', 'Division I', '220kV', 640, 420, 375, 'Critical', 4, 8, 2004, 60, 35, 29.39, 76.97, 4, '2026-02-18', 'Thermal Power Station Road, Panipat, Haryana'),
('SS-220-02', '220kV Rohtak Bypass', 'RTK-220', 'Rohtak Circle', 'Central Zone', 'Division I', '220kV', 480, 310, 265, 'Moderate', 3, 6, 2011, 48, 62, 28.89, 76.61, 2, '2026-04-28', 'Outer Ring Road, Near PGIMS, Rohtak, Haryana'),
('SS-220-03', '220kV Karnal Sector 32', 'KRL-220', 'Karnal Circle', 'North Zone', 'Division II', '220kV', 500, 320, 280, 'Healthy', 3, 5, 2016, 68, 28, 29.69, 76.98, 0, '2026-05-12', 'Sector 32 Urban Estate, Karnal, Haryana'),
('SS-220-04', '220kV Ambala City', 'AMB-220', 'Ambala Circle', 'North Zone', 'Division I', '220kV', 460, 290, 240, 'Healthy', 3, 6, 2008, 38, 15, 30.37, 76.78, 0, '2026-05-01', 'Baldev Nagar, GT Road, Ambala City, Haryana'),
('SS-132-01', '132kV Kaithal', 'KTH-132', 'Karnal Circle', 'North Zone', 'Division III', '132kV', 240, 160, 135, 'Moderate', 2, 4, 2013, 44, 30, 29.80, 76.40, 1, '2026-04-15', 'Jind Road, Kaithal, Haryana'),
('SS-132-02', '132kV Jind Industrial Area', 'JND-132', 'Jind Circle', 'Central Zone', 'Division I', '132kV', 200, 145, 118, 'Healthy', 2, 4, 2010, 46, 44, 29.32, 76.31, 0, '2026-05-08', 'Industrial Area, Hansi Road, Jind, Haryana'),
('SS-132-03', '132kV Yamunanagar Jagadhri', 'YNR-132', 'Yamunanagar Circle', 'North Zone', 'Division I', '132kV', 280, 195, 172, 'Healthy', 3, 5, 2014, 58, 12, 30.13, 77.29, 0, '2026-04-20', 'Workshop Road, Yamunanagar, Haryana'),
('SS-132-04', '132kV Faridabad Sector 25', 'FBD-132', 'Faridabad Circle', 'South Zone', 'Division II', '132kV', 320, 240, 215, 'Outage', 3, 6, 2006, 74, 82, 28.36, 77.31, 5, '2026-01-25', 'Sector 25, Ballabgarh Industrial Area, Faridabad, Haryana'),
('SS-66-01', '66kV Narwana', 'NRW-66', 'Jind Circle', 'Central Zone', 'Division II', '66kV', 100, 68, 58, 'Critical', 2, 3, 2017, 38, 40, 29.60, 76.12, 2, '2026-03-05', 'Near Railway Crossing, Narwana, Jind, Haryana'),
('SS-66-02', '66kV Panchkula Sector 12', 'PKL-66', 'Ambala Circle', 'North Zone', 'Division II', '66kV', 120, 82, 74, 'Healthy', 2, 4, 2018, 55, 6, 30.69, 76.86, 0, '2026-05-14', 'Sector 12-A, Urban Estate, Panchkula, Haryana');

-- Transmission Lines
INSERT INTO transmission_lines (id, name, code, from_substation, to_substation, circle, zone, voltage, length_km, status, loading_pct, current_flow_mw, capacity_mw, tripping_count, last_patrolled) VALUES
('TL-400-01', '400kV D/C Bawal – Daultabad (Gurugram)', 'BWL-DLT-400', '400kV Bawal', '400kV Daultabad', 'Gurugram Circle', 'South Zone', '400kV', 68.4, 'In Service', 68.2, 485, 710, 1, '2026-05-10'),
('TL-400-02', '400kV D/C Kirori (Hisar) – Bhiwani', 'KRR-BHW-400', '400kV Kirori (Hisar)', '400kV Kirori (Hisar)', 'Hisar Circle', 'Central Zone', '400kV', 76.2, 'In Service', 74.5, 520, 700, 0, '2026-05-08'),
('TL-220-01', '220kV D/C Rohtak Bypass – Panipat BBMB', 'RTK-PNP-220', '220kV Rohtak Bypass', '220kV Panipat BBMB/HVPNL', 'Rohtak Circle', 'Central Zone', '220kV', 71.0, 'Tripped', 0, 0, 280, 5, '2026-05-15'),
('TL-220-02', '220kV D/C Karnal – Kaithal', 'KRL-KTH-220', '220kV Karnal Sector 32', '132kV Kaithal', 'Karnal Circle', 'North Zone', '220kV', 62.5, 'In Service', 82.4, 230, 280, 2, '2026-05-01'),
('TL-132-01', '132kV S/C Ambala City – Panchkula', 'AMB-PKL-132', '220kV Ambala City', '66kV Panchkula Sector 12', 'Ambala Circle', 'North Zone', '132kV', 42.8, 'In Service', 61.5, 74, 120, 0, '2026-05-12'),
('TL-66-01', '66kV D/C Narwana – Kalayat', 'NRW-KLY-66', '66kV Narwana', '132kV Jind Industrial Area', 'Jind Circle', 'Central Zone', '66kV', 28.5, 'Under Maintenance', 0, 0, 45, 3, '2026-05-17');

-- Transformers
INSERT INTO transformers (id, substation_id, substation_name, name, circle, zone, voltage, capacity_mva, loading_pct, current_load_mva, oil_temperature_c, winding_temperature_c, health_status, dga_status, make, year_of_mfg, last_tested) VALUES
('TR-400-01', 'SS-400-01', '400kV Bawal', '315 MVA ICT-1', 'Rewari Circle', 'South Zone', '400/220kV', 315, 88.5, 278.8, 72, 84, 'Critical', 'Warning', 'BHEL', 2012, '2026-04-12'),
('TR-400-02', 'SS-400-02', '400kV Daultabad (Gurugram)', '315 MVA ICT-2', 'Gurugram Circle', 'South Zone', '400/220kV', 315, 62.1, 195.6, 54, 61, 'Healthy', 'Normal', 'ABB', 2018, '2026-05-02'),
('TR-220-01', 'SS-220-01', '220kV Panipat BBMB/HVPNL', '160 MVA PTR-1', 'Panipat Circle', 'North Zone', '220/66kV', 160, 94.2, 150.7, 78, 91, 'Critical', 'Critical', 'Crompton Greaves', 2004, '2026-03-20'),
('TR-220-02', 'SS-220-02', '220kV Rohtak Bypass', '100 MVA PTR-2', 'Rohtak Circle', 'Central Zone', '220/132kV', 100, 76.4, 76.4, 59, 68, 'Moderate', 'Caution', 'Siemens', 2011, '2026-04-28'),
('TR-132-01', 'SS-132-01', '132kV Kaithal', '50 MVA PTR-1', 'Karnal Circle', 'North Zone', '132/33kV', 50, 56.0, 28.0, 48, 54, 'Healthy', 'Normal', 'Schneider Electric', 2016, '2026-04-15'),
('TR-132-02', 'SS-132-04', '132kV Faridabad Sector 25', '50 MVA PTR-2', 'Faridabad Circle', 'South Zone', '132/33kV', 50, 104.5, 52.2, 86, 101, 'Outage', 'Critical', 'Voltamp', 2006, '2026-01-25');

-- Observations
INSERT INTO observations (id, observation_no, substation, circle, zone, voltage, equipment, equipment_type, description, severity, status, reported_date, due_date, days_pending, inspector_name, assigned_engineer, remarks) VALUES
('OBS-001', 'MP-BWL-2026-089', '400kV Bawal', 'Gurugram Circle', 'South Zone', '400kV', 'Power Transformer-1', 'Transformer', 'Oil leakage observed from conservator tank flange gasket & OLTC inspection glass blurred', 'Critical', 'Critical Pending', '2026-04-02', '2026-04-17', 45, 'Er. R. K. Sharma (XEN M&P)', 'Er. Amit Verma (SDO TS)', 'Gasket replacement kit indented from Central Stores. Scheduled for upcoming planned shutdown.'),
('OBS-002', 'MP-PNP-2026-114', '220kV Panipat BBMB/HVPNL', 'Panipat Circle', 'North Zone', '220kV', 'ICT-1 160MVA', 'Transformer', 'Buchholz relay trip contact found sluggish during secondary injection test; oil sample shows high acetylene (C2H2 = 18 ppm)', 'Critical', 'Critical Pending', '2026-03-18', '2026-04-02', 60, 'Er. S. S. Malik (SE M&P)', 'Er. Vikas Dahiya (SDO Maint)', 'Immediate DGA re-test recommended. D-energization requested from SLDC.'),
('OBS-003', 'MP-KTH-2026-042', '132kV Kaithal', 'Karnal Circle', 'North Zone', '132kV', '132kV Circuit Breaker (CB-102)', 'Circuit Breaker', 'Spring charging motor defective; manual charging being used during emergency operations', 'Critical', 'Critical Pending', '2026-04-20', '2026-05-05', 27, 'Er. Anil Gupta (AE M&P)', 'Er. Sandeep Rana (JE-1)', 'Replacement 220V DC motor procured; installation pending PTW approval.'),
('OBS-004', 'MP-NRW-2026-078', '66kV Narwana', 'Jind Circle', 'Central Zone', '66kV', '66kV Bus Isolator ISO-601', 'Isolator', 'Contact wear & severe thermal heating (Delta T > 45°C) observed under thermography camera', 'Critical', 'Critical Pending', '2026-05-01', '2026-05-15', 16, 'Er. Dinesh Kumar (SDO M&P)', 'Er. Rajesh Hooda (SDO TS)', 'Isolator jaw contacts polished temporarily; complete assembly replacement advised.'),
('OBS-005', 'MP-RTK-2026-105', '220kV Rohtak Bypass', 'Rohtak Circle', 'Central Zone', '220kV', 'PLCC Wave Trap WT-201', 'Wave Trap', 'High VSWR (> 2.8) observed; carrier communication link dropping intermittent carrier signal', 'Critical', 'Critical Pending', '2026-04-14', '2026-04-29', 33, 'Er. M. P. Singh (XEN Comm)', 'Er. Gaurav Chawla (SDO Comm)', 'Line matching unit (LMU) tuning unit capacitor adjusted; fine tuning underway.'),
('OBS-006', 'MP-GGM-2026-152', '400kV Daultabad (Gurugram)', 'Gurugram Circle', 'South Zone', '400kV', 'Differential Relay (87T)', 'Relay', 'Numerical relay firmware update pending; self-supervision watchdog LED intermittent', 'Moderate', 'Pending', '2026-05-05', '2026-05-25', 12, 'Er. R. K. Sharma (XEN M&P)', 'Er. Tarun Sethi (AE M&P)', 'OEM support engineer scheduled for site visit on Monday.'),
('OBS-007', 'MP-AMB-2026-031', '220kV Ambala City', 'Ambala Circle', 'North Zone', '220kV', 'Station Battery Bank (220V DC)', 'Battery Bank', 'Cell #14 & #38 specific gravity below 1.180; individual boost charger required', 'Moderate', 'Closed', '2026-03-10', '2026-03-25', 0, 'Er. Anil Gupta (AE M&P)', 'Er. Naresh Pal (JE DC)', 'Electrolyte topped up and boost equalization cycle executed successfully. Closed.'),
('OBS-008', 'MP-FBD-2026-210', '132kV Faridabad Sector 25', 'Faridabad Circle', 'South Zone', '132kV', 'Current Transformer (CT) R-Phase', 'CT/PT', 'Tan delta value increased to 0.0082 (Threshold < 0.005); dielectric dissipation test failure', 'Critical', 'Critical Pending', '2026-04-18', '2026-05-02', 29, 'Er. S. S. Malik (SE M&P)', 'Er. Pankaj Garg (SDO TS)', 'Spare 132kV CT mobilized from Ballabgarh store.');

-- Maintenance Records
INSERT INTO maintenance_records (id, asset_type, asset_name, substation, circle, zone, cycle, financial_year, status, due_date, completion_date, engineer_in_charge, remarks) VALUES
('MNT-001', 'Transformer', '315 MVA ICT-1 Bawal', '400kV Bawal', 'Rewari Circle', 'South Zone', 'Annual', '2026-27', 'Overdue', '2026-04-15', NULL, 'Er. Amit Verma', 'DGA testing, oil filtration, and OLTC mechanism servicing overdue by 32 days'),
('MNT-002', 'Substation', '220kV Switchyard Rohtak', '220kV Rohtak Bypass', 'Rohtak Circle', 'Central Zone', 'Half Yearly', '2026-27', 'Done', '2026-05-01', '2026-04-28', 'Er. Rajesh Hooda', 'Busbar insulator washing, earth pit resistance testing (< 0.5 ohm verified)'),
('MNT-003', 'Transmission Line', '400kV Bawal-Daultabad Line', '400kV Bawal', 'Gurugram Circle', 'South Zone', 'Quarterly', '2026-27', 'Done', '2026-05-15', '2026-05-10', 'Er. Tarun Sethi', 'Tower footing resistance check, drone thermography of span joints completed'),
('MNT-004', 'Circuit Breaker', '220kV SF6 Breaker CB-201', '220kV Panipat BBMB/HVPNL', 'Panipat Circle', 'North Zone', 'Monthly', '2026-27', 'Pending', '2026-05-28', NULL, 'Er. Vikas Dahiya', 'SF6 gas pressure logging, dew point measurement, timing test scheduled'),
('MNT-005', 'Protection Scheme', 'Numerical Busbar Protection Scheme', '400kV Daultabad (Gurugram)', 'Gurugram Circle', 'South Zone', 'Annual', '2026-27', 'Done', '2026-05-10', '2026-05-02', 'Er. R. K. Sharma', 'Secondary injection testing of all central and bay units passed 100%');

-- Outage Events
INSERT INTO outage_events (id, timestamp, asset_name, asset_type, voltage, circle, outage_type, cause, relay_operated, load_loss_mw, status, duration_minutes, restoration_time) VALUES
('EVT-2026-058', '2026-05-20 09:14:00+05:30', '220kV Rohtak-Panipat Ckt-1', 'Transmission Line', '220kV', 'Rohtak Circle', 'Forced', 'Heavy storm & tree branch fallen on conductor near Gohana tower #84', 'Distance Relay (Zone 1 - 24.6 km, R-N Fault)', 140, 'Tripped', 76, NULL),
('EVT-2026-057', '2026-05-19 14:40:00+05:30', '50 MVA PTR-2 Faridabad', 'Transformer', '132kV', 'Faridabad Circle', 'Forced', 'Differential relay trip (87T) due to internal winding inter-turn flashover', 'Master Trip Relay (86A) + Differential (87T)', 45, 'Under Restoration', 1320, NULL),
('EVT-2026-056', '2026-05-18 06:00:00+05:30', '400kV Kirori Bay-4 CB', 'Substation Bus', '400kV', 'Hisar Circle', 'Planned', 'Scheduled annual overhaul and contact resistance measurement by OEM', 'N/A (Planned Shutdown)', 0, 'Restored', 360, '2026-05-18 12:00:00+05:30');

-- Grid Alerts
INSERT INTO grid_alerts (id, timestamp, title, message, severity, substation, equipment, acknowledged) VALUES
('ALT-01', CURRENT_TIMESTAMP - INTERVAL '10 minutes', 'Critical Tripping Alert: 220kV Rohtak-Panipat Ckt-1', 'Tripped on Zone-1 Distance Protection (R-N Fault, 24.6km). SLDC notified for alternative route.', 'critical', '220kV Rohtak Bypass', 'Transmission Line Ckt-1', FALSE),
('ALT-02', CURRENT_TIMESTAMP - INTERVAL '25 minutes', 'Transformer High Temp Alarm: 315 MVA ICT-1 Bawal', 'Winding Temperature exceeded threshold: 84°C (Warning limit 80°C). Forced cooling bank-2 auto-started.', 'warning', '400kV Bawal', 'ICT-1 315MVA', FALSE),
('ALT-03', CURRENT_TIMESTAMP - INTERVAL '1 hour', 'Overdue M&P Observation: Buchholz Relay Test', 'Observation MP-PNP-2026-114 has been pending for 60 days. Immediate executive intervention required.', 'critical', '220kV Panipat BBMB/HVPNL', 'ICT-1 160MVA', TRUE),
('ALT-04', CURRENT_TIMESTAMP - INTERVAL '2 hours', 'SF6 Low Gas Pressure Warning (Stage 1)', '66kV Narwana CB-602 SF6 gas pressure dropped to 5.2 bar (Rated 6.0 bar).', 'warning', '66kV Narwana', 'CB-602', TRUE),
('ALT-05', CURRENT_TIMESTAMP - INTERVAL '3 hours', 'Grid Frequency Stabilized within IEGC Band', 'System frequency sustained at 50.02 Hz across all Haryana transmission nodes.', 'info', 'State Load Despatch Centre (SLDC Sewah)', NULL, TRUE);

-- Notifications
INSERT INTO notifications (id, timestamp, title, message, type, read) VALUES
('NOTIF-01', CURRENT_TIMESTAMP - INTERVAL '15 minutes', 'Annual Maintenance Schedule FY 2026-27 Approved', 'Chief Engineer (TS) has approved the Q2 preventive maintenance schedule for North Zone.', 'maintenance', FALSE),
('NOTIF-02', CURRENT_TIMESTAMP - INTERVAL '45 minutes', 'M&P Audit Report Uploaded: Gurugram Circle', 'Inspection report containing 42 observations uploaded by XEN M&P Gurugram.', 'audit', FALSE),
('NOTIF-03', CURRENT_TIMESTAMP - INTERVAL '2 hours', 'Weather Warning: Thunderstorm & High Winds', 'IMD Alert: Squall wind speeds up to 65 km/h predicted in Ambala, Yamunanagar, Karnal circles.', 'weather', FALSE),
('NOTIF-04', CURRENT_TIMESTAMP - INTERVAL '5 hours', 'SCADA Telemetry System Health Check Complete', 'All 178 RTUs reporting RTU data latency < 800ms to SLDC servers.', 'system', TRUE),
('NOTIF-05', CURRENT_TIMESTAMP - INTERVAL '1 day', 'Monthly Energy Accounting (April 2026) Published', 'Total Energy wheeled across Haryana transmission network: 2,845.2 MU (Transmission Loss: 1.42%).', 'system', TRUE);

COMMIT;
