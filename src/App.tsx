import React from "react";
import { HashRouter } from "react-router-dom";
import AppRoutes from "./routes";
import Layout from "./components/Layout";

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <AppRoutes />
      </Layout>
    </HashRouter>
  );
};

export default App;
