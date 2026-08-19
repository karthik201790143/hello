import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
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
import {
  mockSubstations,
  mockTransmissionLines,
  mockTransformers,
  mockObservations,
  mockMaintenanceRecords,
  mockOutageEvents,
  mockAlerts,
  mockNotifications,
} from '../data/mockData';

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
  addObservation: (obs: Omit<Observation, 'id' | 'observationNo' | 'daysPending'>) => void;
  updateObservationStatus: (id: string, status: ObservationStatus, remarks?: string) => void;
  addMaintenanceRecord: (rec: Omit<MaintenanceRecord, 'id'>) => void;
  markMaintenanceDone: (id: string) => void;
  acknowledgeAlert: (id: string) => void;
  acknowledgeAllAlerts: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

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
  const [liveTrippingsCount, setLiveTrippingsCount] = useState(128);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [lastDataRefresh, setLastDataRefresh] = useState('20-May-2026 10:30 AM');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Datasets state (dynamic & mutable)
  const [substationsList] = useState<Substation[]>(mockSubstations);
  const [linesList] = useState<TransmissionLine[]>(mockTransmissionLines);
  const [transformersList] = useState<Transformer[]>(mockTransformers);
  const [observationsList, setObservationsList] = useState<Observation[]>(mockObservations);
  const [maintenanceList, setMaintenanceList] = useState<MaintenanceRecord[]>(mockMaintenanceRecords);
  const [outageList, setOutageList] = useState<OutageEvent[]>(mockOutageEvents);
  const [alertsList, setAlertsList] = useState<GridAlert[]>(mockAlerts);
  const [notificationsList, setNotificationsList] = useState<NotificationItem[]>(mockNotifications);

  // Modals state
  const [selectedSubstation, setSelectedSubstation] = useState<Substation | null>(null);
  const [selectedTransformer, setSelectedTransformer] = useState<Transformer | null>(null);
  const [selectedObservation, setSelectedObservation] = useState<Observation | null>(null);
  const [isNewObservationModalOpen, setIsNewObservationModalOpen] = useState(false);
  const [isAlertsDrawerOpen, setIsAlertsDrawerOpen] = useState(false);
  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedMapCity, setSelectedMapCity] = useState<string | null>(null);

  // Live frequency & load fluctuation timer
  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      // Oscillate frequency smoothly between 49.94 Hz and 50.06 Hz
      const freqDelta = (Math.random() - 0.5) * 0.03;
      setLiveFrequency(prev => {
        const next = Number((prev + freqDelta).toFixed(2));
        return next < 49.85 ? 49.92 : next > 50.15 ? 50.08 : next;
      });

      // Fluctuate load between 6190 MW and 6320 MW
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

  const triggerDataRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      setLastDataRefresh(`${dateStr} ${timeStr}`);
      setIsRefreshing(false);
      setFilterAppliedNotification('SCADA Telemetry & Asset Data refreshed from HVPNL servers.');
      setTimeout(() => setFilterAppliedNotification(null), 3000);
    }, 600);
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
        return ss.name.toLowerCase().includes(q) || ss.code.toLowerCase().includes(q) || ss.circle.toLowerCase().includes(q);
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
        return line.name.toLowerCase().includes(q) || line.code.toLowerCase().includes(q) || line.circle.toLowerCase().includes(q);
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
        return tr.name.toLowerCase().includes(q) || tr.substationName.toLowerCase().includes(q) || tr.circle.toLowerCase().includes(q);
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
          obs.observationNo.toLowerCase().includes(q) ||
          obs.substation.toLowerCase().includes(q) ||
          obs.equipment.toLowerCase().includes(q) ||
          obs.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [observationsList, filters]);

  const filteredMaintenance = useMemo(() => {
    return maintenanceList.filter(m => {
      if (filters.zone !== 'All Zones' && m.zone !== filters.zone) return false;
      if (filters.circle !== 'All Circles' && m.circle !== filters.circle) return false;
      if (filters.maintenanceCycle !== 'All Cycles' && m.cycle !== filters.maintenanceCycle) return false;
      if (filters.financialYear && m.financialYear !== filters.financialYear) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        return m.assetName.toLowerCase().includes(q) || m.substation.toLowerCase().includes(q);
      }
      return true;
    });
  }, [maintenanceList, filters]);

  const filteredOutages = useMemo(() => {
    return outageList.filter(ev => {
      if (filters.circle !== 'All Circles' && ev.circle !== filters.circle) return false;
      if (filters.voltageLevel !== 'All Voltages' && ev.voltage !== filters.voltageLevel) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        return ev.assetName.toLowerCase().includes(q) || ev.cause.toLowerCase().includes(q) || ev.id.toLowerCase().includes(q);
      }
      return true;
    });
  }, [outageList, filters]);

  // Summary Metrics Dynamic Calculation
  const summaryMetrics = useMemo(() => {
    const isGlobal = filters.circle === 'All Circles' && filters.zone === 'All Zones' && filters.voltageLevel === 'All Voltages';

    // Scale proportional metrics when specific circle is selected, or use benchmark counts
    const totalSubstations = isGlobal ? 178 : filteredSubstations.length * 12;
    const totalLines = isGlobal ? 8893 : Math.round(filteredLines.reduce((acc, l) => acc + l.lengthKm, 0) * 15);
    const totalTransformers = isGlobal ? 312 : filteredTransformers.length * 24;
    const totalCapacityMVA = isGlobal ? 12540 : Math.round(filteredSubstations.reduce((acc, s) => acc + s.capacityMVA, 0) * 2.2);

    // Maintenance Metrics
    const maintenanceDue = isGlobal ? 4856 : Math.round(4856 * (filteredSubstations.length / 13));
    const maintenanceDone = isGlobal ? 3421 : Math.round(3421 * (filteredSubstations.length / 13));
    const maintenancePending = maintenanceDue - maintenanceDone;
    const maintenanceOverdue = isGlobal ? 246 : Math.round(246 * (filteredSubstations.length / 13));
    const maintenanceCompletionPct = Number(((maintenanceDone / (maintenanceDue || 1)) * 100).toFixed(2));

    // M&P Observation Metrics
    const totalObservations = isGlobal ? 2374 : Math.round(2374 * (filteredObservations.length / 8));
    const criticalPendingCount = isGlobal ? 198 : filteredObservations.filter(o => o.status === 'Critical Pending').length * 25;
    const observationsClosed = isGlobal ? 1058 : Math.round(1058 * (filteredObservations.length / 8));
    const observationsPending = totalObservations - observationsClosed;
    const observationsOverdue = isGlobal ? 162 : Math.round(162 * (filteredObservations.length / 8));
    const mpCompliancePct = Number(((observationsClosed / (totalObservations || 1)) * 100).toFixed(2));

    // Health breakdowns
    const substationHealthBreakdown = {
      healthy: Math.round(totalSubstations * 0.517),
      moderate: Math.round(totalSubstations * 0.326),
      critical: Math.round(totalSubstations * 0.112),
      outage: Math.max(1, Math.round(totalSubstations * 0.045)),
    };

    const transformerHealthBreakdown = {
      healthy: Math.round(totalTransformers * 0.58),
      moderate: Math.round(totalTransformers * 0.28),
      critical: Math.round(totalTransformers * 0.10),
      outage: Math.max(1, Math.round(totalTransformers * 0.04)),
    };

    const lineHealthBreakdown = {
      healthy: Math.round(totalLines * 0.72),
      moderate: Math.round(totalLines * 0.21),
      critical: Math.round(totalLines * 0.05),
      outage: Math.round(totalLines * 0.02),
    };

    const transformerLoadingBreakdown = {
      under60: Math.round(totalTransformers * 0.365),
      between60_80: Math.round(totalTransformers * 0.497),
      between80_100: Math.round(totalTransformers * 0.099),
      over100: Math.round(totalTransformers * 0.038),
      avgLoading: 68,
    };

    const cycleMultiplier = isGlobal ? 1 : filteredSubstations.length / 13;
    const cycleWiseMaintenance = [
      { cycle: 'Annual', total: Math.round(1152 * cycleMultiplier), done: Math.round(832 * cycleMultiplier), pending: Math.round(320 * cycleMultiplier), overdue: Math.round(48 * cycleMultiplier) },
      { cycle: 'Half Yearly', total: Math.round(1246 * cycleMultiplier), done: Math.round(916 * cycleMultiplier), pending: Math.round(330 * cycleMultiplier), overdue: Math.round(62 * cycleMultiplier) },
      { cycle: 'Quarterly', total: Math.round(1284 * cycleMultiplier), done: Math.round(918 * cycleMultiplier), pending: Math.round(366 * cycleMultiplier), overdue: Math.round(74 * cycleMultiplier) },
      { cycle: 'Monthly', total: Math.round(1174 * cycleMultiplier), done: Math.round(755 * cycleMultiplier), pending: Math.round(419 * cycleMultiplier), overdue: Math.round(62 * cycleMultiplier) },
    ];

    const circleCriticalObservations = [
      { circle: 'Gurugram Circle', count: 42 },
      { circle: 'Rohtak Circle', count: 38 },
      { circle: 'Hisar Circle', count: 32 },
      { circle: 'Panipat Circle', count: 27 },
      { circle: 'Ambala Circle', count: 26 },
      { circle: 'Karnal Circle', count: 19 },
      { circle: 'Rewari Circle', count: 14 },
    ];

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
  }, [filters, filteredSubstations, filteredLines, filteredTransformers, filteredObservations]);

  // Actions
  const addObservation = (newObs: Omit<Observation, 'id' | 'observationNo' | 'daysPending'>) => {
    const id = `OBS-${Date.now().toString().slice(-4)}`;
    const observationNo = `MP-${newObs.substation.slice(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const created: Observation = {
      ...newObs,
      id,
      observationNo,
      daysPending: 1,
    };
    setObservationsList(prev => [created, ...prev]);
    setFilterAppliedNotification(`New M&P Observation ${observationNo} logged successfully!`);
    setTimeout(() => setFilterAppliedNotification(null), 4000);
  };

  const updateObservationStatus = (id: string, status: ObservationStatus, remarks?: string) => {
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
    setFilterAppliedNotification(`Observation ${id} updated to ${status}.`);
    setTimeout(() => setFilterAppliedNotification(null), 3000);
  };

  const addMaintenanceRecord = (rec: Omit<MaintenanceRecord, 'id'>) => {
    const id = `MNT-${Date.now().toString().slice(-4)}`;
    const created: MaintenanceRecord = {
      ...rec,
      id,
    };
    setMaintenanceList(prev => [created, ...prev]);
    setFilterAppliedNotification(`Maintenance task scheduled for ${rec.assetName}!`);
    setTimeout(() => setFilterAppliedNotification(null), 3500);
  };

  const markMaintenanceDone = (id: string) => {
    setMaintenanceList(prev =>
      prev.map(m => {
        if (m.id === id) {
          return {
            ...m,
            status: 'Done',
            completionDate: new Date().toISOString().split('T')[0],
          };
        }
        return m;
      })
    );
    setFilterAppliedNotification('Maintenance record marked as DONE.');
    setTimeout(() => setFilterAppliedNotification(null), 3000);
  };

  const acknowledgeAlert = (id: string) => {
    setAlertsList(prev => prev.map(a => (a.id === id ? { ...a, acknowledged: true } : a)));
  };

  const acknowledgeAllAlerts = () => {
    setAlertsList(prev => prev.map(a => ({ ...a, acknowledged: true })));
  };

  const markNotificationRead = (id: string) => {
    setNotificationsList(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
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
