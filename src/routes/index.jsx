import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from '../components/common/Layout';
import PageSkeleton from '../components/common/PageSkeleton';
import { useAuth } from '../context/AuthContext';

// Lazy loading page views
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Leads = lazy(() => import('../pages/Leads'));
const Analytics = lazy(() => import('../pages/Analytics'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));

/**
 * Route guarding wrapper that verifies user authentication.
 * Displays a loading skeleton during active session recovery scans.
 */
const ProtectedRoute = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <PageSkeleton />;
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        {/* Public Authentication Portals */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Secure CRM Application Area */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="leads" element={<Leads />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Route>

        {/* Full screen 404 View */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
