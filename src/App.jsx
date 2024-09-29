import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import './css/style.css';

import './charts/ChartjsConfig';

// Authentication and Authorization Component
import ProtectedRoute from './components/auth/ProtectedRoute';
import Unauthorized from './components/auth/Unauthorized';

// Universal Pages
import LandingPage from './pages/LandingPage';

// Auth Pages
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

// User Pages
import UserDashboard from './pages/user/UserDashboard';

function App() {
	const location = useLocation();

	useEffect(() => {
		document.querySelector('html').style.scrollBehavior = 'auto';
		window.scroll({ top: 0 });
		document.querySelector('html').style.scrollBehavior = '';
	}, [location.pathname]); // triggered on route change

	return (
		<>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/auth/register" element={<Register />} />
				<Route path="/auth/login" element={<Login />} />

				<Route
					path="/admin/admin-dashboard"
					element={
						<ProtectedRoute allowedRoles={['admin']}>
							<AdminDashboard />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/user/user-dashboard"
					element={
						<ProtectedRoute allowedRoles={['user', 'admin']}>
							<UserDashboard />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</>
	);
}

export default App;
