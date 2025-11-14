import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from './store/authStore';
import { useConfigStore } from './store/configStore';
import { syncService } from './lib/sync';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Navbar from './components/Layout/Navbar';
import POS from './components/POS/POS';
import ProductList from './components/Inventory/ProductList';
import SalesReport from './components/Reports/SalesReport';
import Settings from './components/Settings/Settings';
import './utils/i18n';

function App() {
  const { i18n } = useTranslation();
  const { initialize: initAuth, user } = useAuthStore();
  const { loadConfig, config } = useConfigStore();

  useEffect(() => {
    // Initialize auth
    initAuth();
    
    // Load config
    loadConfig();
    
    // Start sync service
    syncService.startSync();
    
    // Set language from config
    if (config.language) {
      i18n.changeLanguage(config.language);
    }
    
    return () => {
      syncService.stopSync();
    };
  }, [initAuth, loadConfig, config.language, i18n]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/pos"
          element={
            <ProtectedRoute>
              {user && <Navbar />}
              <POS />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute requiredRole="manager">
              <Navbar />
              <ProductList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute requiredRole="manager">
              <Navbar />
              <SalesReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/pos" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
