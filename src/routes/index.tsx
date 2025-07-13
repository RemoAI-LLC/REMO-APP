import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import SmartApply from "../pages/SmartApply";
import Usecases from "../pages/Usecases";
import Integrations from "../pages/Integrations";
import Pricing from "../pages/Pricing";
import PaymentSuccess from "../pages/PaymentSuccess";
import UpgradePlan from "../pages/UpgradePlan";
import Billing from "../pages/Billing";
import Settings from "../pages/Settings";
import FontSizeDemo from "../components/FontSizeDemo";
import ProtectedRoute from "./ProtectedRoute";
import DataAnalystUpload from "../components/DataAnalystUpload";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      <Route path="/home" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/usecases" element={
        <ProtectedRoute>
          <Usecases />
        </ProtectedRoute>
      } />
      <Route path="/SmartApply" element={
        <ProtectedRoute>
          <SmartApply />
        </ProtectedRoute>
      } />
      <Route path="/integrations" element={
        <ProtectedRoute>
          <Integrations />
        </ProtectedRoute>
      } />
      <Route path="/Pricing" element={<Pricing />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/upgrade" element={<UpgradePlan />} />
      <Route path="/billing" element={<Billing />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/font-demo" element={<FontSizeDemo />} />
      <Route path="/data-analyst" element={
        <ProtectedRoute>
          <DataAnalystUpload />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;
