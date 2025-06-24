import React from "react";
import { HashRouter } from "react-router-dom";
import AppRoutes from "./routes";
import Layout from "./components/Layout";
import PrivyAuthGate from "./components/PrivyAuthGate";

const App: React.FC = () => {
  return (
    <HashRouter>
      <PrivyAuthGate>
        <Layout>
          <AppRoutes />
        </Layout>
      </PrivyAuthGate>
    </HashRouter>
  );
};

export default App;
