import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Substation,
  TransmissionLine,
  Transformer,
  Observation,
  MaintenanceRecord,
  OutageEvent,
  GridAlert,
  NotificationItem,
  FilterState,
  ActiveView,
  TimePeriod,
  ObservationStatus,
} from '../types';
import { supabase } from '../lib/supabaseClient';
import {
  mapToSubstation,
  mapToTransmissionLine,
  mapToTransformer,
  mapToObservation,
  mapToMaintenanceRecord,
  mapToOutageEvent,
  mapToGridAlert,
  mapToNotification,
} from '../lib/supabaseAdapters';

interface DashboardContextType {
  // Navigation
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  assetSubTab: 'substations' | 'lines' | 'transformers';
  setAssetSubTab: (tab: 'substations' | 'lines' | 'transformers') => void;

  // Filters
  filters: FilterState;
  setFilter: (key: keyof FilterState, value: string) => void;
  setTimePeriod: (period: TimePeriod) => void;
  resetFilters: () => void;
  applyFilters: () => void;
  filterAppliedNotification: string | null;

  // Live Telemetry
  liveFrequency: number;
  liveTotalLoadMW: number;
  liveGridAvailability: number;
  liveTrippingsCount: number;
  isLiveStreaming: boolean;
  setIsLiveStreaming: React.Dispatch<React.SetStateAction<boolean>>;
  lastDataRefresh: string;
  triggerDataRefresh: () => void;
  isRefreshing: boolean;
  isSupabaseConnected: boolean;
  isLoading: boolean;

  // Datasets
  substations: Substation[];
  transmissionLines: TransmissionLine[];
  transformers: Transformer[];
  observations: Observation[];
  maintenanceRecords: MaintenanceRecord[];
  outageEvents: OutageEvent[];
  alerts: GridAlert[];
  notifications: NotificationItem[];

  // Dynamic Calculated Summary Metrics
  summaryMetrics: {
    totalSubstations: number;
    totalLines: number;
    totalTransformers: number;
    totalCapacityMVA: number;
    maintenanceDue: number;
    maintenanceDone: number;
    maintenancePending: number;
    maintenanceOverdue: number;
    maintenanceCompletionPct: number;
    totalObservations: number;
    observationsPending: number;
    criticalPendingCount: number;
    observationsClosed: number;
    observationsOverdue: number;
    mpCompliancePct: number;
    substationHealthBreakdown: { healthy: number; moderate: number; critical: number; outage: number };
    transformerHealthBreakdown: { healthy: number; moderate: number; critical: number; outage: number };
    lineHealthBreakdown: { healthy: number; moderate: number; critical: number; outage: number };
    transformerLoadingBreakdown: { under60: number; between60_80: number; between80_100: number; over100: number; avgLoading: number };
    cycleWiseMaintenance: Array<{ cycle: string; total: number; done: number; pending: number; overdue: number }>;
    circleCriticalObservations: Array<{ circle: string; count: number }>;
  };

  // Actions & Updates
  addObservation: (obs: Omit<Observation, 'id' | 'observationNo' | 'daysPending'>) => Promise<void>;
  updateObservationStatus: (id: string, status: ObservationStatus, remarks?: string) => Promise<void>;
  addMaintenanceRecord: (rec: Omit<MaintenanceRecord, 'id'>) => Promise<void>;
  markMaintenanceDone: (id: string) => Promise<void>;
  acknowledgeAlert: (id: string) => Promise<void>;
  acknowledgeAllAlerts: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;

  // Modals & Drawers
  selectedSubstation: Substation | null;
  setSelectedSubstation: (ss: Substation | null) => void;
  selectedTransformer: Transformer | null;
  setSelectedTransformer: (tr: Transformer | null) => void;
  selectedObservation: Observation | null;
  setSelectedObservation: (obs: Observation | null) => void;
  isNewObservationModalOpen: boolean;
  setIsNewObservationModalOpen: (open: boolean) => void;
  isAlertsDrawerOpen: boolean;
  setIsAlertsDrawerOpen: (open: boolean) => void;
  isNotificationsDrawerOpen: boolean;
  setIsNotificationsDrawerOpen: (open: boolean) => void;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  selectedMapCity: string | null;
  setSelectedMapCity: (city: string | null) => void;
}

const initialFilters: FilterState = {
  financialYear: '2026-27',
  zone: 'All Zones',
  circle: 'All Circles',
  division: 'All Divisions',
  voltageLevel: 'All Voltages',
  assetType: 'All Assets',
  maintenanceCycle: 'All Cycles',
  timePeriod: 'Today',
  searchQuery: '',
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [assetSubTab, setAssetSubTab] = useState<'substations' | 'lines' | 'transformers'>('substations');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [filterAppliedNotification, setFilterAppliedNotification] = useState<string | null>(null);

  // Live Telemetry Simulation
  const [liveFrequency, setLiveFrequency] = useState(50.02);
  const [liveTotalLoadMW, setLiveTotalLoadMW] = useState(6245);
  const [liveGridAvailability] = useState(99.48);
  const [liveTrippingsCount] = useState(128);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [lastDataRefresh, setLastDataRefresh] = useState('20-May-2026 10:30 AM');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Datasets state
  const [substationsList, setSubstationsList] = useState<Substation[]>([]);
  const [linesList, setLinesList] = useState<TransmissionLine[]>([]);
  const [transformersList, setTransformersList] = useState<Transformer[]>([]);
  const [observationsList, setObservationsList] = useState<Observation[]>([]);
  const [maintenanceList, setMaintenanceList] = useState<MaintenanceRecord[]>([]);
  const [outageList, setOutageList] = useState<OutageEvent[]>([]);
  const [alertsList, setAlertsList] = useState<GridAlert[]>([]);
  const [notificationsList, setNotificationsList] = useState<NotificationItem[]>([]);

  // Modals state
  const [selectedSubstation, setSelectedSubstation] = useState<Substation | null>(null);
  const [selectedTransformer, setSelectedTransformer] = useState<Transformer | null>(null);
  const [selectedObservation, setSelectedObservation] = useState<Observation | null>(null);
  const [isNewObservationModalOpen, setIsNewObservationModalOpen] = useState(false);
  const [isAlertsDrawerOpen, setIsAlertsDrawerOpen] = useState(false);
  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedMapCity, setSelectedMapCity] = useState<string | null>(null);

  // Fetch live datasets directly from Supabase
  const loadDataFromSupabase = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        { data: subsData },
        { data: linesData },
        { data: trData },
        { data: obsData },
        { data: mntData },
        { data: outData },
        { data: altData },
        { data: notData },
      ] = await Promise.all([
        supabase.from('substations').select('*'),
        supabase.from('transmission_lines').select('*'),
        supabase.from('transformers').select('*'),
        supabase.from('observations').select('*'),
        supabase.from('maintenance_records').select('*'),
        supabase.from('outage_events').select('*'),
        supabase.from('grid_alerts').select('*'),
        supabase.from('notifications').select('*'),
      ]);

      if (subsData) setSubstationsList(subsData.map(mapToSubstation));
      if (linesData) setLinesList(linesData.map(mapToTransmissionLine));
      if (trData) setTransformersList(trData.map(mapToTransformer));
      if (obsData) setObservationsList(obsData.map(mapToObservation));
      if (mntData) setMaintenanceList(mntData.map(mapToMaintenanceRecord));
      if (outData) setOutageList(outData.map(mapToOutageEvent));
      if (altData) setAlertsList(altData.map(mapToGridAlert));
      if (notData) setNotificationsList(notData.map(mapToNotification));

      setIsSupabaseConnected(true);
    } catch (err) {
      console.error('Error fetching data from Supabase:', err);
      setIsSupabaseConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load on startup
  useEffect(() => {
    loadDataFromSupabase();
  }, [loadDataFromSupabase]);

  // Live frequency & load fluctuation timer
  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      const freqDelta = (Math.random() - 0.5) * 0.03;
      setLiveFrequency(prev => {
        const next = Number((prev + freqDelta).toFixed(2));
        return next < 49.85 ? 49.92 : next > 50.15 ? 50.08 : next;
      });

      const loadDelta = Math.round((Math.random() - 0.5) * 16);
      setLiveTotalLoadMW(prev => {
        const next = prev + loadDelta;
        return next < 6100 ? 6200 : next > 6400 ? 6280 : next;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // Set filter handler
  const setFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const setTimePeriod = (period: TimePeriod) => {
    setFilters(prev => ({ ...prev, timePeriod: period }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setFilterAppliedNotification('Filters have been reset to default values.');
    setTimeout(() => setFilterAppliedNotification(null), 3000);
  };

  const applyFilters = () => {
    setFilterAppliedNotification(`Filters applied: ${filters.circle !== 'All Circles' ? filters.circle : 'All Haryana'} | FY ${filters.financialYear}`);
    setTimeout(() => setFilterAppliedNotification(null), 3500);
  };

  const triggerDataRefresh = async () => {
    setIsRefreshing(true);
    await loadDataFromSupabase();
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setLastDataRefresh(`${dateStr} ${timeStr}`);
    setIsRefreshing(false);
    setFilterAppliedNotification('Refreshed data directly from Supabase.');
    setTimeout(() => setFilterAppliedNotification(null), 3000);
  };

  // Filtered Datasets based on current active filters
  const filteredSubstations = useMemo(() => {
    return substationsList.filter(ss => {
      if (filters.zone !== 'All Zones' && ss.zone !== filters.zone) return false;
      if (filters.circle !== 'All Circles' && ss.circle !== filters.circle) return false;
      if (filters.division !== 'All Divisions' && ss.division !== filters.division) return false;
      if (filters.voltageLevel !== 'All Voltages' && ss.voltage !== filters.voltageLevel) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        return ss.name?.toLowerCase().includes(q) || ss.code?.toLowerCase().includes(q) || ss.circle?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [substationsList, filters]);

  const filteredLines = useMemo(() => {
    return linesList.filter(line => {
      if (filters.zone !== 'All Zones' && line.zone !== filters.zone) return false;
      if (filters.circle !== 'All Circles' && line.circle !== filters.circle) return false;
      if (filters.voltageLevel !== 'All Voltages' && line.voltage !== filters.voltageLevel) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        return line.name?.toLowerCase().includes(q) || line.code?.toLowerCase().includes(q) || line.circle?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [linesList, filters]);

  const filteredTransformers = useMemo(() => {
    return transformersList.filter(tr => {
      if (filters.zone !== 'All Zones' && tr.zone !== filters.zone) return false;
      if (filters.circle !== 'All Circles' && tr.circle !== filters.circle) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        return tr.name?.toLowerCase().includes(q) || tr.substationName?.toLowerCase().includes(q) || tr.circle?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [transformersList, filters]);

  const filteredObservations = useMemo(() => {
    return observationsList.filter(obs => {
      if (filters.zone !== 'All Zones' && obs.zone !== filters.zone) return false;
      if (filters.circle !== 'All Circles' && obs.circle !== filters.circle) return false;
      if (filters.voltageLevel !== 'All Voltages' && obs.voltage !== filters.voltageLevel) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        return (
          obs.observationNo?.toLowerCase().includes(q) ||
          obs.substation?.toLowerCase().includes(q) ||
          obs.equipment?.toLowerCase().includes(q) ||
          obs.description?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [observationsList, filters]);

  const filteredMaintenance = useMemo(() => {
    return maintenanceList.filter(m => {
      if (filters.financialYear && m.financialYear !== filters.financialYear) return false;
      if (filters.zone !== 'All Zones' && m.zone !== filters.zone) return false;
      if (filters.circle !== 'All Circles' && m.circle !== filters.circle) return false;
      if (filters.maintenanceCycle !== 'All Cycles' && m.cycle !== filters.maintenanceCycle) return false;
      if (filters.assetType !== 'All Assets' && m.assetType !== filters.assetType) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        return m.assetName?.toLowerCase().includes(q) || m.substation?.toLowerCase().includes(q) || m.engineerInCharge?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [maintenanceList, filters]);

  const filteredOutages = useMemo(() => {
    return outageList.filter(o => {
      if (filters.circle !== 'All Circles' && o.circle !== filters.circle) return false;
      if (filters.voltageLevel !== 'All Voltages' && o.voltage !== filters.voltageLevel) return false;
      if (filters.assetType !== 'All Assets' && o.assetType !== filters.assetType) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        return o.assetName?.toLowerCase().includes(q) || o.cause?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [outageList, filters]);

  // Dynamic Calculated Summary Metrics
  const summaryMetrics = useMemo(() => {
    const totalSubstations = filteredSubstations.length;
    const totalLines = filteredLines.length;
    const totalTransformers = filteredTransformers.length;
    const totalCapacityMVA = filteredSubstations.reduce((acc, ss) => acc + (Number(ss.capacityMVA) || 0), 0);

    const maintenanceDone = filteredMaintenance.filter(m => m.status === 'Done').length;
    const maintenancePending = filteredMaintenance.filter(m => m.status === 'Pending').length;
    const maintenanceOverdue = filteredMaintenance.filter(m => m.status === 'Overdue').length;
    const maintenanceDue = maintenancePending + maintenanceOverdue;
    const totalMnt = filteredMaintenance.length;
    const maintenanceCompletionPct = totalMnt > 0 ? Number(((maintenanceDone / totalMnt) * 100).toFixed(1)) : 0;

    const totalObservations = filteredObservations.length;
    const observationsPending = filteredObservations.filter(o => o.status === 'Pending' || o.status === 'Under Rectification').length;
    const criticalPendingCount = filteredObservations.filter(o => o.status === 'Critical Pending').length;
    const observationsClosed = filteredObservations.filter(o => o.status === 'Closed').length;
    const observationsOverdue = filteredObservations.filter(o => o.daysPending > 15 && o.status !== 'Closed').length;
    const mpCompliancePct = totalObservations > 0 ? Number(((observationsClosed / totalObservations) * 100).toFixed(1)) : 0;

    const substationHealthBreakdown = {
      healthy: filteredSubstations.filter(s => s.health === 'Healthy').length,
      moderate: filteredSubstations.filter(s => s.health === 'Moderate').length,
      critical: filteredSubstations.filter(s => s.health === 'Critical').length,
      outage: filteredSubstations.filter(s => s.health === 'Outage').length,
    };

    const transformerHealthBreakdown = {
      healthy: filteredTransformers.filter(t => t.healthStatus === 'Healthy').length,
      moderate: filteredTransformers.filter(t => t.healthStatus === 'Moderate').length,
      critical: filteredTransformers.filter(t => t.healthStatus === 'Critical').length,
      outage: filteredTransformers.filter(t => t.healthStatus === 'Outage').length,
    };

    const lineHealthBreakdown = {
      healthy: filteredLines.filter(l => l.status === 'In Service').length,
      moderate: 0,
      critical: filteredLines.filter(l => l.status === 'Under Maintenance').length,
      outage: filteredLines.filter(l => l.status === 'Tripped').length,
    };

    const transformerLoadingBreakdown = {
      under60: filteredTransformers.filter(t => t.loadingPct < 60).length,
      between60_80: filteredTransformers.filter(t => t.loadingPct >= 60 && t.loadingPct <= 80).length,
      between80_100: filteredTransformers.filter(t => t.loadingPct > 80 && t.loadingPct <= 100).length,
      over100: filteredTransformers.filter(t => t.loadingPct > 100).length,
      avgLoading: totalTransformers > 0 ? Math.round(filteredTransformers.reduce((acc, t) => acc + (Number(t.loadingPct) || 0), 0) / totalTransformers) : 0,
    };

    const cycles = ['Annual', 'Half Yearly', 'Quarterly', 'Monthly'];
    const cycleWiseMaintenance = cycles.map(cycle => {
      const inCycle = filteredMaintenance.filter(m => m.cycle === cycle);
      return {
        cycle,
        total: inCycle.length,
        done: inCycle.filter(m => m.status === 'Done').length,
        pending: inCycle.filter(m => m.status === 'Pending').length,
        overdue: inCycle.filter(m => m.status === 'Overdue').length,
      };
    });

    const circles = ['Gurugram Circle', 'Panipat Circle', 'Rohtak Circle', 'Karnal Circle', 'Ambala Circle', 'Faridabad Circle', 'Jind Circle'];
    const circleCriticalObservations = circles.map(circle => ({
      circle: circle.replace(' Circle', ''),
      count: filteredObservations.filter(o => o.circle === circle && (o.severity === 'Critical' || o.status === 'Critical Pending')).length,
    }));

    return {
      totalSubstations,
      totalLines,
      totalTransformers,
      totalCapacityMVA,
      maintenanceDue,
      maintenanceDone,
      maintenancePending,
      maintenanceOverdue,
      maintenanceCompletionPct,
      totalObservations,
      observationsPending,
      criticalPendingCount,
      observationsClosed,
      observationsOverdue,
      mpCompliancePct,
      substationHealthBreakdown,
      transformerHealthBreakdown,
      lineHealthBreakdown,
      transformerLoadingBreakdown,
      cycleWiseMaintenance,
      circleCriticalObservations,
    };
  }, [filteredSubstations, filteredLines, filteredTransformers, filteredObservations, filteredMaintenance]);

  // Actions directly hitting Supabase (with snake_case fallback for DB schema compatibility)
  const addObservation = async (newObs: Omit<Observation, 'id' | 'observationNo' | 'daysPending'>) => {
    const id = `OBS-${Date.now().toString().slice(-4)}`;
    const observationNo = `MP-${newObs.substation.slice(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const created: Observation = {
      ...newObs,
      id,
      observationNo,
      daysPending: 1,
    };

    // Update UI immediately
    setObservationsList(prev => [created, ...prev]);

    // Try snake_case insertion first (standard PostgreSQL)
    const snakeCasePayload = {
      id: created.id,
      observation_no: created.observationNo,
      substation: created.substation,
      circle: created.circle,
      zone: created.zone,
      voltage: created.voltage,
      equipment: created.equipment,
      equipment_type: created.equipmentType,
      description: created.description,
      severity: created.severity,
      status: created.status,
      reported_date: created.reportedDate,
      due_date: created.dueDate,
      days_pending: created.daysPending,
      inspector_name: created.inspectorName,
      assigned_engineer: created.assignedEngineer,
      remarks: created.remarks,
    };

    let { error } = await supabase.from('observations').insert([snakeCasePayload]);
    if (error && error.code === 'PGRST204') {
      // Fallback to camelCase if table was created with quoted columns
      const camelCasePayload = {
        id: created.id,
        observationNo: created.observationNo,
        substation: created.substation,
        circle: created.circle,
        zone: created.zone,
        voltage: created.voltage,
        equipment: created.equipment,
        equipmentType: created.equipmentType,
        description: created.description,
        severity: created.severity,
        status: created.status,
        reportedDate: created.reportedDate,
        dueDate: created.dueDate,
        daysPending: created.daysPending,
        inspectorName: created.inspectorName,
        assignedEngineer: created.assignedEngineer,
        remarks: created.remarks,
      };
      const res = await supabase.from('observations').insert([camelCasePayload]);
      error = res.error;
    }

    if (error) {
      console.error('Supabase addObservation error:', error);
    } else {
      setFilterAppliedNotification(`New M&P Observation ${observationNo} saved to Supabase!`);
      setTimeout(() => setFilterAppliedNotification(null), 4000);
    }
  };

  const updateObservationStatus = async (id: string, status: ObservationStatus, remarks?: string) => {
    setObservationsList(prev =>
      prev.map(obs => {
        if (obs.id === id) {
          return {
            ...obs,
            status,
            daysPending: status === 'Closed' ? 0 : obs.daysPending,
            remarks: remarks || obs.remarks,
          };
        }
        return obs;
      })
    );

    let { error } = await supabase.from('observations').update({
      status,
      days_pending: status === 'Closed' ? 0 : undefined,
      remarks: remarks || undefined,
    }).eq('id', id);

    if (error && error.code === 'PGRST204') {
      const res = await supabase.from('observations').update({
        status,
        daysPending: status === 'Closed' ? 0 : undefined,
        remarks: remarks || undefined,
      }).eq('id', id);
      error = res.error;
    }

    if (error) console.error('Supabase updateObservationStatus error:', error);

    setFilterAppliedNotification(`Observation ${id} updated to ${status} in Supabase.`);
    setTimeout(() => setFilterAppliedNotification(null), 3000);
  };

  const addMaintenanceRecord = async (rec: Omit<MaintenanceRecord, 'id'>) => {
    const id = `MNT-${Date.now().toString().slice(-4)}`;
    const created: MaintenanceRecord = {
      ...rec,
      id,
    };

    setMaintenanceList(prev => [created, ...prev]);

    const snakePayload = {
      id: created.id,
      asset_type: created.assetType,
      asset_name: created.assetName,
      substation: created.substation,
      circle: created.circle,
      zone: created.zone,
      cycle: created.cycle,
      financial_year: created.financialYear,
      status: created.status,
      due_date: created.dueDate,
      completion_date: created.completionDate,
      engineer_in_charge: created.engineerInCharge,
      remarks: created.remarks,
    };

    let { error } = await supabase.from('maintenance_records').insert([snakePayload]);
    if (error && error.code === 'PGRST204') {
      const camelPayload = {
        id: created.id,
        assetType: created.assetType,
        assetName: created.assetName,
        substation: created.substation,
        circle: created.circle,
        zone: created.zone,
        cycle: created.cycle,
        financialYear: created.financialYear,
        status: created.status,
        dueDate: created.dueDate,
        completionDate: created.completionDate,
        engineerInCharge: created.engineerInCharge,
        remarks: created.remarks,
      };
      const res = await supabase.from('maintenance_records').insert([camelPayload]);
      error = res.error;
    }

    if (error) console.error('Supabase addMaintenanceRecord error:', error);

    setFilterAppliedNotification(`Maintenance task scheduled in Supabase for ${rec.assetName}!`);
    setTimeout(() => setFilterAppliedNotification(null), 3500);
  };

  const markMaintenanceDone = async (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setMaintenanceList(prev =>
      prev.map(m => {
        if (m.id === id) {
          return {
            ...m,
            status: 'Done',
            completionDate: today,
          };
        }
        return m;
      })
    );

    let { error } = await supabase.from('maintenance_records').update({
      status: 'Done',
      completion_date: today,
    }).eq('id', id);

    if (error && error.code === 'PGRST204') {
      const res = await supabase.from('maintenance_records').update({
        status: 'Done',
        completionDate: today,
      }).eq('id', id);
      error = res.error;
    }

    if (error) console.error('Supabase markMaintenanceDone error:', error);

    setFilterAppliedNotification('Maintenance record marked as DONE in Supabase.');
    setTimeout(() => setFilterAppliedNotification(null), 3000);
  };

  const acknowledgeAlert = async (id: string) => {
    setAlertsList(prev => prev.map(a => (a.id === id ? { ...a, acknowledged: true } : a)));
    const { error } = await supabase.from('grid_alerts').update({ acknowledged: true }).eq('id', id);
    if (error) console.error('Supabase acknowledgeAlert error:', error);
  };

  const acknowledgeAllAlerts = async () => {
    setAlertsList(prev => prev.map(a => ({ ...a, acknowledged: true })));
    const { error } = await supabase.from('grid_alerts').update({ acknowledged: true }).neq('id', '');
    if (error) console.error('Supabase acknowledgeAllAlerts error:', error);
  };

  const markNotificationRead = async (id: string) => {
    setNotificationsList(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
    if (error) console.error('Supabase markNotificationRead error:', error);
  };

  const markAllNotificationsRead = async () => {
    setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
    const { error } = await supabase.from('notifications').update({ read: true }).neq('id', '');
    if (error) console.error('Supabase markAllNotificationsRead error:', error);
  };

  return (
    <DashboardContext.Provider
      value={{
        activeView,
        setActiveView,
        assetSubTab,
        setAssetSubTab,
        filters,
        setFilter,
        setTimePeriod,
        resetFilters,
        applyFilters,
        filterAppliedNotification,
        liveFrequency,
        liveTotalLoadMW,
        liveGridAvailability,
        liveTrippingsCount,
        isLiveStreaming,
        setIsLiveStreaming,
        lastDataRefresh,
        triggerDataRefresh,
        isRefreshing,
        isSupabaseConnected,
        isLoading,
        substations: filteredSubstations,
        transmissionLines: filteredLines,
        transformers: filteredTransformers,
        observations: filteredObservations,
        maintenanceRecords: filteredMaintenance,
        outageEvents: filteredOutages,
        alerts: alertsList,
        notifications: notificationsList,
        summaryMetrics,
        addObservation,
        updateObservationStatus,
        addMaintenanceRecord,
        markMaintenanceDone,
        acknowledgeAlert,
        acknowledgeAllAlerts,
        markNotificationRead,
        markAllNotificationsRead,
        selectedSubstation,
        setSelectedSubstation,
        selectedTransformer,
        setSelectedTransformer,
        selectedObservation,
        setSelectedObservation,
        isNewObservationModalOpen,
        setIsNewObservationModalOpen,
        isAlertsDrawerOpen,
        setIsAlertsDrawerOpen,
        isNotificationsDrawerOpen,
        setIsNotificationsDrawerOpen,
        isExportModalOpen,
        setIsExportModalOpen,
        selectedMapCity,
        setSelectedMapCity,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
