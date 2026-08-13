import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../shared/layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { ErrorBoundary } from '../shared/components/feedback/ErrorBoundary';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { OperationsPage } from '../pages/OperationsPage';
import { CRMPage } from '../pages/CRMPage';
import { FleetPage } from '../pages/FleetPage';
import { DriversAndTeamPage } from '../pages/DriversAndTeamPage';
import { ServicesAndRoutesPage } from '../pages/ServicesAndRoutesPage';
import { FinancePage } from '../pages/FinancePage';
import { ReportsPage } from '../pages/ReportsPage';
import { DocumentsCenterPage } from '../pages/DocumentsCenterPage';
import { CommunicationPage } from '../pages/CommunicationPage';
import { AuditLogsPage } from '../pages/AuditLogsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

const getBasename = () => {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
    return '/admin';
  }
  return '';
};


export const AppRouter: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter basename={getBasename()}>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Application Workspace */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="dashboard/*" element={<DashboardPage />} />
              <Route path="operations/*" element={<OperationsPage />} />
              <Route path="crm/*" element={<CRMPage />} />
              <Route path="fleet/*" element={<FleetPage />} />
              <Route path="drivers-team/*" element={<DriversAndTeamPage />} />
              <Route path="services-routes/*" element={<ServicesAndRoutesPage />} />
              <Route path="finance/*" element={<FinancePage />} />
              <Route path="reports/*" element={<ReportsPage />} />
              <Route path="documents/*" element={<DocumentsCenterPage />} />
              <Route path="communication/*" element={<CommunicationPage />} />
              <Route path="audit-logs/*" element={<AuditLogsPage />} />
              <Route path="settings/*" element={<SettingsPage />} />

              {/* 404 Page Inside Persistent App Layout */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>

          {/* Root Router Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};
