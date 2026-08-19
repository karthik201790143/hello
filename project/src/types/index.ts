export type VoltageLevel = '400kV' | '220kV' | '132kV' | '66kV';
export type AssetHealth = 'Healthy' | 'Moderate' | 'Critical' | 'Outage';
export type ObservationStatus = 'Critical Pending' | 'Pending' | 'Closed' | 'Under Rectification';
export type ObservationSeverity = 'Critical' | 'Moderate' | 'Low';
export type MaintenanceCycleType = 'Annual' | 'Half Yearly' | 'Quarterly' | 'Monthly';
export type TimePeriod = 'Today' | 'Yesterday' | '7 Days' | '30 Days' | 'FYTD';

export interface Substation {
  id: string;
  name: string;
  code: string;
  circle: string;
  zone: string;
  division: string;
  voltage: VoltageLevel;
  capacityMVA: number;
  peakLoadMW: number;
  currentLoadMW: number;
  health: AssetHealth;
  transformersCount: number;
  linesCount: number;
  commissioningYear: number;
  coordinates: { x: number; y: number; lat: number; lng: number };
  activeAlarms: number;
  lastMaintenance: string;
  address: string;
}

export interface TransmissionLine {
  id: string;
  name: string;
  code: string;
  fromSubstation: string;
  toSubstation: string;
  circle: string;
  zone: string;
  voltage: VoltageLevel;
  lengthKm: number;
  status: 'In Service' | 'Under Maintenance' | 'Tripped';
  loadingPct: number;
  currentFlowMW: number;
  capacityMW: number;
  trippingCount: number;
  lastPatrolled: string;
}

export interface Transformer {
  id: string;
  substationId: string;
  substationName: string;
  name: string;
  circle: string;
  zone: string;
  voltage: string; // e.g. "400/220kV"
  capacityMVA: number;
  loadingPct: number;
  currentLoadMVA: number;
  oilTemperatureC: number;
  windingTemperatureC: number;
  healthStatus: AssetHealth;
  dgaStatus: 'Normal' | 'Caution' | 'Warning' | 'Critical';
  make: string;
  yearOfMfg: number;
  lastTested: string;
}

export interface Observation {
  id: string;
  observationNo: string;
  substation: string;
  circle: string;
  zone: string;
  voltage: VoltageLevel;
  equipment: string;
  equipmentType: 'Transformer' | 'Circuit Breaker' | 'Isolator' | 'Wave Trap' | 'CT/PT' | 'Relay' | 'Battery Bank' | 'Busbar';
  description: string;
  severity: ObservationSeverity;
  status: ObservationStatus;
  reportedDate: string;
  dueDate: string;
  daysPending: number;
  inspectorName: string;
  assignedEngineer: string;
  remarks?: string;
}

export interface MaintenanceRecord {
  id: string;
  assetType: 'Transformer' | 'Substation' | 'Transmission Line' | 'Circuit Breaker' | 'Protection Scheme';
  assetName: string;
  substation: string;
  circle: string;
  zone: string;
  cycle: MaintenanceCycleType;
  financialYear: string;
  status: 'Done' | 'Pending' | 'Overdue';
  dueDate: string;
  completionDate?: string;
  engineerInCharge: string;
  remarks: string;
}

export interface OutageEvent {
  id: string;
  timestamp: string;
  assetName: string;
  assetType: 'Transmission Line' | 'Transformer' | 'Substation Bus';
  voltage: VoltageLevel;
  circle: string;
  outageType: 'Forced' | 'Planned' | 'Emergency';
  cause: string;
  relayOperated: string;
  loadLossMW: number;
  status: 'Tripped' | 'Under Restoration' | 'Restored';
  durationMinutes: number;
  restorationTime?: string;
}

export interface GridAlert {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  substation: string;
  equipment?: string;
  acknowledged: boolean;
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  type: 'maintenance' | 'audit' | 'system' | 'weather';
  read: boolean;
}

export interface FilterState {
  financialYear: string;
  zone: string;
  circle: string;
  division: string;
  voltageLevel: string;
  assetType: string;
  maintenanceCycle: string;
  timePeriod: TimePeriod;
  searchQuery: string;
}

export type ActiveView = 
  | 'overview' 
  | 'operations' 
  | 'assets' 
  | 'maintenance' 
  | 'mp-observations' 
  | 'outage-log' 
  | 'reports' 
  | 'analytics' 
  | 'data-explorer';
