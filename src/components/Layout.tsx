import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="w-full h-screen bg-[#fafafa] dark:bg-gray-900">
      {/* Fixed Topbar */}
      <Topbar 
        onMenuClick={() => setSidebarOpen(true)} 
        sidebarExpanded={sidebarExpanded}
      />
      
      {/* Sidebar: controlled by toggle on all screen sizes */}
      <Sidebar
        open={sidebarOpen}
        onOpen={() => setSidebarOpen(true)}
        onClose={toggleSidebar}
        onExpandChange={setSidebarExpanded}
      />
      
      {/* Overlay for sidebar when open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main content area */}
      <div
        className={`
          pt-16 transition-all duration-300 
          ml-0 lg:ml-16
          ${sidebarExpanded ? "lg:ml-64" : "lg:ml-16"}
        `}
      >
        <main className="overflow-y-auto h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
