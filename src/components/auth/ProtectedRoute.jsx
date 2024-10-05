import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const token = localStorage.getItem('authToken');

  if (!token) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  try {
    const decodedToken = jwtDecode(token);

    if (allowedRoles.includes(decodedToken.role)) {
      return children;
    } else {
      // If the user is not allowed, redirect to the login page
      return <Navigate to="/auth/login" replace />;
    }
  } catch (error) {
    return <Navigate to="/auth/login" replace />;
  }
};

export default ProtectedRoute;
