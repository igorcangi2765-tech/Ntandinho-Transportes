import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../shared/layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { ErrorBoundary } from '../shared/components/feedback/ErrorBoundary';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { CRMPage } from '../pages/CRMPage';
import { FleetPage } from '../pages/FleetPage';
import { LoadsPage } from '../pages/LoadsPage';
import { FinancePage } from '../pages/FinancePage';
import { AuditLogsPage } from '../pages/AuditLogsPage';
import { ReportsPage } from '../pages/ReportsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRouter: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter basename="/admin">
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Application Workspace */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="dashboard/*" element={<DashboardPage />} />
              <Route path="crm/*" element={<CRMPage />} />
              <Route path="fleet/*" element={<FleetPage />} />
              <Route path="loads/*" element={<LoadsPage />} />
              <Route path="finance/*" element={<FinancePage />} />
              <Route path="reports/*" element={<ReportsPage />} />
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
