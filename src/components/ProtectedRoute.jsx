import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';

const ProtectedRoute = ({ children }) => {
  const { checkSession } = useAdminAuth();
  const location = useLocation();

  // Check session on every render of protected route
  const isValid = checkSession();

  if (!isValid) {
    // Redirect to login, save the attempted location
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
