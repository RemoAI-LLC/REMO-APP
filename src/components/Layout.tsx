import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="w-full h-screen bg-[#fafafa] dark:bg-gray-900">
      <Sidebar onExpandChange={setSidebarExpanded} />

      <div
        className={`transition-all duration-300 ml-16 ${
          sidebarExpanded ? "lg:ml-64" : "lg:ml-16"
        }`}
      >
        <Topbar />
        <main className="overflow-y-auto h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
