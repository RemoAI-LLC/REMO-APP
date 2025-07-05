import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="w-full h-screen bg-[#fafafa] dark:bg-gray-900">
      {/* Sidebar: overlay on mobile, always visible on desktop */}
      <Sidebar
        open={sidebarOpen}
        onOpen={() => setSidebarOpen(true)}
        onClose={() => setSidebarOpen(false)}
        onExpandChange={setSidebarExpanded}
      />
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`transition-all duration-300 lg:ml-16 ${
          sidebarExpanded ? "lg:ml-64" : ""
        }`}
      >
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="overflow-y-auto h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
