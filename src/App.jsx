import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import VendorRegistration from './pages/VendorRegistration';
import AllVendors from './pages/AllVendors';
import VendorDetails from './pages/VendorDetails';
import VerificationReports from './pages/VerificationReports';
import WorkflowMonitor from './pages/WorkflowMonitor';
import AuditHistory from './pages/AuditHistory';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Login Route (Image 1 style with gradient beam border) */}
            <Route path="/login" element={<Login />} />

            {/* Core Application Shell */}
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="register" element={<VendorRegistration />} />
              <Route path="vendors" element={<AllVendors />} />
              <Route path="vendors/:id" element={<VendorDetails />} />
              <Route path="reports" element={<VerificationReports />} />
              <Route path="workflow" element={<WorkflowMonitor />} />
              <Route path="audit" element={<AuditHistory />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
