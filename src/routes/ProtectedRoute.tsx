import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSubscriptionAccess } from '../hooks/useSubscriptionAccess';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { checkAccess } = useSubscriptionAccess();
  const location = useLocation();
  const { hasAccess } = checkAccess();

  // Temporarily allow access to data-analyst for testing
  if (location.pathname === '/data-analyst') {
    return <>{children}</>;
  }

  if (!hasAccess) {
    return <Navigate to="/pricing" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 