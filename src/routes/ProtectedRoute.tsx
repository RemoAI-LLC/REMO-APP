import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSubscriptionAccess } from "../hooks/useSubscriptionAccess";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { hasAccess, subscription } = useSubscriptionAccess();
  const location = useLocation();

  console.log("🔍 ProtectedRoute - hasAccess:", hasAccess);
  console.log("🔍 ProtectedRoute - subscription:", subscription);
  console.log("🔍 ProtectedRoute - current path:", location.pathname);

  // Temporarily allow access to data-analyst for testing
  if (location.pathname === "/data-analyst") {
    return <>{children}</>;
  }

  // If we don't have access, redirect to pricing
  if (!hasAccess) {
    console.log(
      "🔒 Access denied, redirecting to pricing. Subscription:",
      subscription
    );
    return <Navigate to="/pricing" replace state={{ from: location }} />;
  }

  console.log("✅ Access granted, rendering protected content");
  return <>{children}</>;
};

export default ProtectedRoute;
