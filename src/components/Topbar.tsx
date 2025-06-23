import React from "react";

const Topbar: React.FC = () => {
  return (
    <header className="w-full h-16 bg-gray-900 text-white border-b border-gray-700 z-40 flex items-center justify-between px-6">
      <h1 className="text-lg font-bold text-white">REMO</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-300">AI Assistant</span>
      </div>
    </header>
  );
};

export default Topbar;
