import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import SmartApply from "../pages/SmartApply";
import Usecases from "../pages/Usecases";
import Integrations from "../pages/Integrations";
import Pricing from "../pages/Pricing";
import PaymentSuccess from "../pages/PaymentSuccess";
import { useAccess } from "../context/AccessContext";
import UpgradePlan from "../pages/UpgradePlan";
import Billing from "../pages/Billing";
// import UsecasePage from '../pages/UsecasePage';

const AppRoutes: React.FC = () => {
  const { hasAccess } = useAccess();
  const location = useLocation();
  const allowedWithoutAccess = ["/pricing", "/payment-success", "/logout"];
  if (!hasAccess && !allowedWithoutAccess.includes(location.pathname)) {
    return <Navigate to="/pricing" replace />;
  }
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/usecases" element={<Usecases />} />
      <Route path="/SmartApply" element={<SmartApply />} />
      <Route path="/integrations" element={<Integrations />} />
      <Route path="/Pricing" element={<Pricing />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/upgrade" element={<UpgradePlan />} />
      <Route path="/billing" element={<Billing />} />
    </Routes>
  );
};

export default AppRoutes;
