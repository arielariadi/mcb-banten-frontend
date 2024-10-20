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
import ManageSubmissionPage from './pages/admin/ManageSubmissionPage';
import ManageWithdrawalPage from './pages/admin/ManageWithdrawal';

// User Pages
import UserDashboardPage from './pages/user/UserDashboardPage';
import TasksListPage from './pages/user/TasksListPage';
import SubmitTaskPage from './pages/user/SubmitTaskPage';
import RequestWithdrawalPage from './pages/user/RequestWithdrawalPage';
import UserProfilePage from './pages/user/UserProfilePage';

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
        <Route
          path="/admin/manage-submission"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageSubmissionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-withdrawal"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageWithdrawalPage />
            </ProtectedRoute>
          }
        />
        {/* End Admin Routes */}

        {/* User Routes */}
        <Route
          path="/user/user-dashboard"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <UserDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/tasks-list"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <TasksListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/submit-task"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <SubmitTaskPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/request-withdrawal"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <RequestWithdrawalPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/user-profile"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
      {/* End User Routes */}
    </>
  );
}

export default App;
