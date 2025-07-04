import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthForm from '../hooks/useAuthForm';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthForm();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
