import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ProtectedRoute } from './guards/ProtectedRoute';
import { AppLayout } from './layouts/AppLayout';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
