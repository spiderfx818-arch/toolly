import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ToolLoader } from './pages/ToolLoader';
import { AppLoader } from './pages/AppLoader';
import { DashboardPage } from './pages/DashboardPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:slug" element={<HomePage />} />
        <Route path="/details/:slug" element={<HomePage />} />
        <Route path="/search" element={<HomePage />} />

        <Route path="/tools/:slug" element={<ToolLoader />} />
        <Route path="/apps/:slug" element={<AppLoader />} />

        <Route path="/dashboard/login" element={<AdminLoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/admin" element={<Navigate to="/dashboard/login" replace />} />
        <Route path="/admin/login" element={<Navigate to="/dashboard/login" replace />} />
        <Route path="/admin/dashboard" element={<Navigate to="/dashboard" replace />} />
        <Route path="/manage" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard-admin" element={<Navigate to="/dashboard" replace />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
