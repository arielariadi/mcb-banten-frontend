import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import './css/style.css';

import './charts/ChartjsConfig';

import 'flowbite';
import 'flowbite-react';

// Authentication and Authorization Component
import ProtectedRoute from './components/auth/ProtectedRoute';
// import Unauthorized from './components/auth/Unauthorized';

// Universal Pages
import LandingPage from './pages/LandingPage';

// Auth Pages
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AddTaskPage from './pages/admin/AddTaskPage';
import DeleteTaskPage from './pages/admin/DeleteTaskPage';

// User Pages
import UserDashboard from './pages/user/UserDashboard';

function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto';
    window.scroll({ top: 0 });
    document.querySelector('html').style.scrollBehavior = '';
  }, [location.pathname]);

  return (
    <>
      <Routes>
        {/* General Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/login" element={<Login />} />
        {/* End General Routes */}

        {/* Admin Routes */}
        <Route
          path="/admin/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-task"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddTaskPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/delete-task"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DeleteTaskPage />
            </ProtectedRoute>
          }
        />
        {/* End Admin Routes */}

        {/* User Routes */}
        <Route
          path="/user/user-dashboard"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      {/* End User Routes */}
    </>
  );
}

export default App;
