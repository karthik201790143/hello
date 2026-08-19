export const ZONES = ['All Zones', 'North Zone', 'Central Zone', 'South Zone'];
export const CIRCLES = [
  'All Circles',
  'Gurugram Circle',
  'Rohtak Circle',
  'Hisar Circle',
  'Panipat Circle',
  'Ambala Circle',
  'Karnal Circle',
  'Rewari Circle',
  'Faridabad Circle',
  'Jind Circle',
  'Yamunanagar Circle',
];

export const DIVISIONS = ['All Divisions', 'Division I', 'Division II', 'Division III', 'Central', 'Suburban'];
export const VOLTAGES = ['All Voltages', '400kV', '220kV', '132kV', '66kV'];
export const ASSET_TYPES = ['All Assets', 'Substations', 'Transmission Lines', 'Transformers', 'Switchgear', 'Protection Relays'];
export const FINANCIAL_YEARS = ['2026-27', '2025-26', '2024-25', '2023-24', '2022-23'];
export const MAINTENANCE_CYCLES = ['All Cycles', 'Annual', 'Half Yearly', 'Quarterly', 'Monthly'];

export const mockHistoricalTrends = {
  energyWheeledMU: [
    { year: '2022-23', value: 28451 },
    { year: '2023-24', value: 30215 },
    { year: '2024-25', value: 31842 },
    { year: '2025-26', value: 32955 },
    { year: '2026-27 (Est.)', value: 34256 },
  ],
  peakDemandMW: [
    { year: '2022-23', value: 3620 },
    { year: '2023-24', value: 3850 },
    { year: '2024-25', value: 4183 },
    { year: '2025-26', value: 4331 },
    { year: '2026-27 (Peak)', value: 4512 },
  ],
  hourlyLoadCurve: [
    { hour: '00:00', loadMW: 4820, frequency: 50.01 },
    { hour: '02:00', loadMW: 4650, frequency: 50.03 },
    { hour: '04:00', loadMW: 4510, frequency: 50.04 },
    { hour: '06:00', loadMW: 4980, frequency: 49.98 },
    { hour: '08:00', loadMW: 5620, frequency: 49.95 },
    { hour: '10:00', loadMW: 6180, frequency: 50.02 },
    { hour: '12:00', loadMW: 6245, frequency: 50.03 },
    { hour: '14:00', loadMW: 6410, frequency: 49.97 },
    { hour: '16:00', loadMW: 6190, frequency: 50.01 },
    { hour: '18:00', loadMW: 6350, frequency: 49.94 },
    { hour: '20:00', loadMW: 6480, frequency: 49.92 },
    { hour: '22:00', loadMW: 5740, frequency: 50.02 },
  ],
};
