import {
  Substation,
  TransmissionLine,
  Transformer,
  Observation,
  MaintenanceRecord,
  OutageEvent,
  GridAlert,
  NotificationItem,
} from '../types';

// Converts any database row (whether snake_case or camelCase) to Substation
export function mapToSubstation(row: any): Substation {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    circle: row.circle,
    zone: row.zone,
    division: row.division,
    voltage: row.voltage,
    capacityMVA: Number(row.capacityMVA ?? row.capacity_mva ?? 0),
    peakLoadMW: Number(row.peakLoadMW ?? row.peak_load_mw ?? 0),
    currentLoadMW: Number(row.currentLoadMW ?? row.current_load_mw ?? 0),
    health: row.health || 'Healthy',
    transformersCount: Number(row.transformersCount ?? row.transformers_count ?? 0),
    linesCount: Number(row.linesCount ?? row.lines_count ?? 0),
    commissioningYear: Number(row.commissioningYear ?? row.commissioning_year ?? 2015),
    coordinates: typeof row.coordinates === 'object' && row.coordinates !== null
      ? row.coordinates
      : {
          x: Number(row.coord_x ?? 50),
          y: Number(row.coord_y ?? 50),
          lat: Number(row.latitude ?? 29.0),
          lng: Number(row.longitude ?? 76.5),
        },
    activeAlarms: Number(row.activeAlarms ?? row.active_alarms ?? 0),
    lastMaintenance: row.lastMaintenance ?? row.last_maintenance ?? '',
    address: row.address || '',
  };
}

export function mapToTransmissionLine(row: any): TransmissionLine {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    fromSubstation: row.fromSubstation ?? row.from_substation ?? '',
    toSubstation: row.toSubstation ?? row.to_substation ?? '',
    circle: row.circle,
    zone: row.zone,
    voltage: row.voltage,
    lengthKm: Number(row.lengthKm ?? row.length_km ?? 0),
    status: row.status || 'In Service',
    loadingPct: Number(row.loadingPct ?? row.loading_pct ?? 0),
    currentFlowMW: Number(row.currentFlowMW ?? row.current_flow_mw ?? 0),
    capacityMW: Number(row.capacityMW ?? row.capacity_mw ?? 0),
    trippingCount: Number(row.trippingCount ?? row.tripping_count ?? 0),
    lastPatrolled: row.lastPatrolled ?? row.last_patrolled ?? '',
  };
}

export function mapToTransformer(row: any): Transformer {
  return {
    id: row.id,
    substationId: row.substationId ?? row.substation_id ?? '',
    substationName: row.substationName ?? row.substation_name ?? '',
    name: row.name,
    circle: row.circle,
    zone: row.zone,
    voltage: row.voltage,
    capacityMVA: Number(row.capacityMVA ?? row.capacity_mva ?? 0),
    loadingPct: Number(row.loadingPct ?? row.loading_pct ?? 0),
    currentLoadMVA: Number(row.currentLoadMVA ?? row.current_load_mva ?? 0),
    oilTemperatureC: Number(row.oilTemperatureC ?? row.oil_temperature_c ?? 0),
    windingTemperatureC: Number(row.windingTemperatureC ?? row.winding_temperature_c ?? 0),
    healthStatus: row.healthStatus ?? row.health_status ?? 'Healthy',
    dgaStatus: row.dgaStatus ?? row.dga_status ?? 'Normal',
    make: row.make || '',
    yearOfMfg: Number(row.yearOfMfg ?? row.year_of_mfg ?? 2015),
    lastTested: row.lastTested ?? row.last_tested ?? '',
  };
}

export function mapToObservation(row: any): Observation {
  return {
    id: row.id,
    observationNo: row.observationNo ?? row.observation_no ?? '',
    substation: row.substation ?? row.substation_name ?? '',
    circle: row.circle,
    zone: row.zone,
    voltage: row.voltage,
    equipment: row.equipment,
    equipmentType: row.equipmentType ?? row.equipment_type ?? 'Transformer',
    description: row.description || '',
    severity: row.severity || 'Moderate',
    status: row.status || 'Pending',
    reportedDate: row.reportedDate ?? row.reported_date ?? '',
    dueDate: row.dueDate ?? row.due_date ?? '',
    daysPending: Number(row.daysPending ?? row.days_pending ?? 0),
    inspectorName: row.inspectorName ?? row.inspector_name ?? '',
    assignedEngineer: row.assignedEngineer ?? row.assigned_engineer ?? '',
    remarks: row.remarks || '',
  };
}

export function mapObservationToDb(obs: Partial<Observation>): Record<string, any> {
  const dbRecord: Record<string, any> = {};
  if (obs.id !== undefined) dbRecord.id = obs.id;
  if (obs.observationNo !== undefined) {
    dbRecord.observationNo = obs.observationNo;
    dbRecord.observation_no = obs.observationNo;
  }
  if (obs.substation !== undefined) {
    dbRecord.substation = obs.substation;
  }
  if (obs.circle !== undefined) dbRecord.circle = obs.circle;
  if (obs.zone !== undefined) dbRecord.zone = obs.zone;
  if (obs.voltage !== undefined) dbRecord.voltage = obs.voltage;
  if (obs.equipment !== undefined) dbRecord.equipment = obs.equipment;
  if (obs.equipmentType !== undefined) {
    dbRecord.equipmentType = obs.equipmentType;
    dbRecord.equipment_type = obs.equipmentType;
  }
  if (obs.description !== undefined) dbRecord.description = obs.description;
  if (obs.severity !== undefined) dbRecord.severity = obs.severity;
  if (obs.status !== undefined) dbRecord.status = obs.status;
  if (obs.reportedDate !== undefined) {
    dbRecord.reportedDate = obs.reportedDate;
    dbRecord.reported_date = obs.reportedDate;
  }
  if (obs.dueDate !== undefined) {
    dbRecord.dueDate = obs.dueDate;
    dbRecord.due_date = obs.dueDate;
  }
  if (obs.daysPending !== undefined) {
    dbRecord.daysPending = obs.daysPending;
    dbRecord.days_pending = obs.daysPending;
  }
  if (obs.inspectorName !== undefined) {
    dbRecord.inspectorName = obs.inspectorName;
    dbRecord.inspector_name = obs.inspectorName;
  }
  if (obs.assignedEngineer !== undefined) {
    dbRecord.assignedEngineer = obs.assignedEngineer;
    dbRecord.assigned_engineer = obs.assignedEngineer;
  }
  if (obs.remarks !== undefined) dbRecord.remarks = obs.remarks;

  return dbRecord;
}

export function mapToMaintenanceRecord(row: any): MaintenanceRecord {
  return {
    id: row.id,
    assetType: row.assetType ?? row.asset_type ?? '',
    assetName: row.assetName ?? row.asset_name ?? '',
    substation: row.substation,
    circle: row.circle,
    zone: row.zone,
    cycle: row.cycle,
    financialYear: row.financialYear ?? row.financial_year ?? '2026-27',
    status: row.status || 'Pending',
    dueDate: row.dueDate ?? row.due_date ?? '',
    completionDate: row.completionDate ?? row.completion_date ?? undefined,
    engineerInCharge: row.engineerInCharge ?? row.engineer_in_charge ?? '',
    remarks: row.remarks || '',
  };
}

export function mapMaintenanceToDb(rec: Partial<MaintenanceRecord>): Record<string, any> {
  const dbRecord: Record<string, any> = {};
  if (rec.id !== undefined) dbRecord.id = rec.id;
  if (rec.assetType !== undefined) {
    dbRecord.assetType = rec.assetType;
    dbRecord.asset_type = rec.assetType;
  }
  if (rec.assetName !== undefined) {
    dbRecord.assetName = rec.assetName;
    dbRecord.asset_name = rec.assetName;
  }
  if (rec.substation !== undefined) dbRecord.substation = rec.substation;
  if (rec.circle !== undefined) dbRecord.circle = rec.circle;
  if (rec.zone !== undefined) dbRecord.zone = rec.zone;
  if (rec.cycle !== undefined) dbRecord.cycle = rec.cycle;
  if (rec.financialYear !== undefined) {
    dbRecord.financialYear = rec.financialYear;
    dbRecord.financial_year = rec.financialYear;
  }
  if (rec.status !== undefined) dbRecord.status = rec.status;
  if (rec.dueDate !== undefined) {
    dbRecord.dueDate = rec.dueDate;
    dbRecord.due_date = rec.dueDate;
  }
  if (rec.completionDate !== undefined) {
    dbRecord.completionDate = rec.completionDate;
    dbRecord.completion_date = rec.completionDate;
  }
  if (rec.engineerInCharge !== undefined) {
    dbRecord.engineerInCharge = rec.engineerInCharge;
    dbRecord.engineer_in_charge = rec.engineerInCharge;
  }
  if (rec.remarks !== undefined) dbRecord.remarks = rec.remarks;

  return dbRecord;
}

export function mapToOutageEvent(row: any): OutageEvent {
  return {
    id: row.id,
    timestamp: row.timestamp,
    assetName: row.assetName ?? row.asset_name ?? '',
    assetType: row.assetType ?? row.asset_type ?? '',
    voltage: row.voltage,
    circle: row.circle,
    outageType: row.outageType ?? row.outage_type ?? 'Forced',
    cause: row.cause,
    relayOperated: row.relayOperated ?? row.relay_operated ?? '',
    loadLossMW: Number(row.loadLossMW ?? row.load_loss_mw ?? 0),
    status: row.status || 'Tripped',
    durationMinutes: Number(row.durationMinutes ?? row.duration_minutes ?? 0),
    restorationTime: row.restorationTime ?? row.restoration_time ?? undefined,
  };
}

export function mapToGridAlert(row: any): GridAlert {
  return {
    id: row.id,
    timestamp: row.timestamp,
    title: row.title,
    message: row.message,
    severity: row.severity,
    substation: row.substation,
    equipment: row.equipment,
    acknowledged: Boolean(row.acknowledged),
  };
}

export function mapToNotification(row: any): NotificationItem {
  return {
    id: row.id,
    timestamp: row.timestamp,
    title: row.title,
    message: row.message,
    type: row.type,
    read: Boolean(row.read),
  };
}
