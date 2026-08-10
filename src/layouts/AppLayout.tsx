import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { GlobalSearchModal } from '../components/layout/GlobalSearchModal';
import { ToastNotificationStack } from '../components/ui/ToastNotification';
import { RoleGuard } from '../guards/RoleGuard';
import { Module } from '../permissions/rbacConfig';

// Pages
import { DashboardPage } from '../pages/DashboardPage';
import { OrdersPage } from '../pages/OrdersPage';
import { TripsPage } from '../pages/TripsPage';
import { CustomersPage } from '../pages/CustomersPage';
import { FleetPage } from '../pages/FleetPage';
import { DriversPage } from '../pages/DriversPage';
import { ServicesPage } from '../pages/ServicesPage';
import { FinancialPage } from '../pages/FinancialPage';
import { ReportsPage } from '../pages/ReportsPage';
import { UsersPage } from '../pages/UsersPage';
import { SettingsPage } from '../pages/SettingsPage';
import { NotFound404Page } from '../pages/NotFound404Page';

export const AppLayout: React.FC = () => {
  const { activeModule } = useData();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderModuleContent = () => {
    switch (activeModule as Module) {
      case 'dashboard':
        return (
          <RoleGuard module="dashboard">
            <DashboardPage />
          </RoleGuard>
        );
      case 'pedidos':
        return (
          <RoleGuard module="pedidos">
            <OrdersPage />
          </RoleGuard>
        );
      case 'viagens':
        return (
          <RoleGuard module="viagens">
            <TripsPage />
          </RoleGuard>
        );
      case 'clientes':
        return (
          <RoleGuard module="clientes">
            <CustomersPage />
          </RoleGuard>
        );
      case 'frota':
        return (
          <RoleGuard module="frota">
            <FleetPage />
          </RoleGuard>
        );
      case 'motoristas':
        return (
          <RoleGuard module="motoristas">
            <DriversPage />
          </RoleGuard>
        );
      case 'servicos':
        return (
          <RoleGuard module="servicos">
            <ServicesPage />
          </RoleGuard>
        );
      case 'financeiro':
        return (
          <RoleGuard module="financeiro">
            <FinancialPage />
          </RoleGuard>
        );
      case 'relatorios':
        return (
          <RoleGuard module="relatorios">
            <ReportsPage />
          </RoleGuard>
        );
      case 'utilizadores':
        return (
          <RoleGuard module="utilizadores">
            <UsersPage />
          </RoleGuard>
        );
      case 'configuracoes':
        return (
          <RoleGuard module="configuracoes">
            <SettingsPage />
          </RoleGuard>
        );
      default:
        return <NotFound404Page />;
    }
  };

  // Precise reactive width calculation to utilize 100% space without horizontal box-model overflow
  const mainStyle = sidebarCollapsed
    ? 'w-full md:w-[calc(100%-5rem)] md:ml-20'
    : 'w-full md:w-[calc(100%-16rem)] md:ml-64';

  return (
    <div className="min-h-screen bg-[#020817] text-slate-100 flex flex-col selection:bg-[#F5A300] selection:text-slate-950 max-w-full overflow-x-hidden w-full">
      {/* Desktop Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Header */}
      <Header sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />

      {/* Main Content Area - Fluid 100% width container */}
      <main className={`app-main-container ${mainStyle}`}>
        <div className="app-content-wrapper">{renderModuleContent()}</div>
      </main>

      {/* Global Command Palette & Toast Notifications */}
      <GlobalSearchModal />
      <ToastNotificationStack />
    </div>
  );
};
