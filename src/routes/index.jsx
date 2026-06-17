import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/common/Layout';

// Lazy loading page views
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Leads = lazy(() => import('../pages/Leads'));
const Analytics = lazy(() => import('../pages/Analytics'));
const NotFound = lazy(() => import('../pages/NotFound'));

const AppRoutes = () => {
  return (
    <Routes>
      {/* CRM Main Layout Wrapper */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="leads" element={<Leads />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>

      {/* Full screen 404 View */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
