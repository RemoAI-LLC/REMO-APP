import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import SmartApply from "../pages/SmartApply";
import Usecases from "../pages/Usecases";
import Integrations from "../pages/Integrations";
import Pricing from "../pages/Pricing";
// import UsecasePage from '../pages/UsecasePage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/usecases" element={<Usecases />} />
      <Route path="/SmartApply" element={<SmartApply />} />
      <Route path="/integrations" element={<Integrations />} />
      <Route path="/Pricing" element={<Pricing />} />
    </Routes>
  );
};

export default AppRoutes;
