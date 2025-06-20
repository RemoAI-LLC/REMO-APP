import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import SmartApply from '../pages/SmartApply';
import Usecases from '../pages/Usecases';
import Integrations from '../pages/Integrations';
// import UsecasePage from '../pages/UsecasePage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/usecases" element={<Usecases />} />
      <Route path="/SmartApply" element={<SmartApply />} />
      <Route path="/integrations" element={<Integrations />} />
    </Routes>
  );
};

export default AppRoutes;