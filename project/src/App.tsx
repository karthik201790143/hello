import React from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Toolbar } from './components/Toolbar';
import { ExecutiveOverview } from './components/Views/ExecutiveOverview';
import { OperationsView } from './components/Views/OperationsView';
import { AssetView } from './components/Views/AssetView';
import { MaintenanceView } from './components/Views/MaintenanceView';
import { ObservationsView } from './components/Views/ObservationsView';
import { OutageLogView } from './components/Views/OutageLogView';
import { ReportsView } from './components/Views/ReportsView';
import { AnalyticsView } from './components/Views/AnalyticsView';
import { DataExplorerView } from './components/Views/DataExplorerView';

import { AlertsDrawer } from './components/Modals/AlertsDrawer';
import { NotificationsDrawer } from './components/Modals/NotificationsDrawer';
import { AssetDetailModal } from './components/Modals/AssetDetailModal';
import { ObservationDetailModal } from './components/Modals/ObservationDetailModal';
import { NewObservationModal } from './components/Modals/NewObservationModal';
import { ExportModal } from './components/Modals/ExportModal';

function DashboardContent() {
  const { activeView } = useDashboard();

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#eef2f6] overflow-x-hidden">
      {/* Top Toolbar */}
      <div className="p-2 pb-1">
        <Toolbar />
      </div>

      {/* Main Dynamic View Content */}
      <main className="flex-1 p-2 pt-1 overflow-y-auto">
        {activeView === 'overview' && <ExecutiveOverview />}
        {activeView === 'operations' && <OperationsView />}
        {activeView === 'assets' && <AssetView />}
        {activeView === 'maintenance' && <MaintenanceView />}
        {activeView === 'mp-observations' && <ObservationsView />}
        {activeView === 'outage-log' && <OutageLogView />}
        {activeView === 'reports' && <ReportsView />}
        {activeView === 'analytics' && <AnalyticsView />}
        {activeView === 'data-explorer' && <DataExplorerView />}
      </main>

      {/* Global Interactive Modals & Drawers */}
      <AlertsDrawer />
      <NotificationsDrawer />
      <AssetDetailModal />
      <ObservationDetailModal />
      <NewObservationModal />
      <ExportModal />
    </div>
  );
}

function App() {
  return (
    <DashboardProvider>
      <div className="min-h-screen flex flex-col bg-[#eef2f6] text-[#17223c] font-sans antialiased">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <DashboardContent />
        </div>
      </div>
    </DashboardProvider>
  );
}

export default App;
