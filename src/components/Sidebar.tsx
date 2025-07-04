import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/MainLogo.png";
// import collapsedLogo from "../assets/Logo1.jpeg";
import { IoGridOutline } from "react-icons/io5";
import { IoCubeOutline } from "react-icons/io5";
import { FiBarChart2 } from "react-icons/fi";
import { TbFileInvoice } from "react-icons/tb";
import { CiSettings } from "react-icons/ci";
import { CiMail } from "react-icons/ci";
import { GrDocumentText } from "react-icons/gr";

interface SidebarProps {
  onExpandChange: (expanded: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onExpandChange }) => {
  const [hovering, setHovering] = useState(false);

  const handleMouseEnter = () => {
    setHovering(true);
    onExpandChange(true);
  };

  const handleMouseLeave = () => {
    setHovering(false);
    onExpandChange(false);
  };

  const isSidebarExpanded = hovering;

  return (
    <div
      className={`transition-all duration-300  border-r border-gray-300 text-text fixed top-0 left-0 h-screen z-50 ${
        isSidebarExpanded ? "w-64" : "w-16"
      } flex flex-col`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Logo */}
      <div className="h-16 flex items-center  px-3  transition-all duration-300">
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-auto transition-all rounded-full duration-300"
          />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-2">
        <Link
          to="/usecases"
          className="flex items-center px-4 py-2 rounded hover:bg-[#dddddd] transition-all duration-300"
        >
          <div className="min-w-[20px] flex justify-center">
            <IoGridOutline size={20} />
          </div>
          <span
            className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${
              isSidebarExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            Explore Use cases
          </span>
        </Link>
        <Link
          to="/integrations"
          className="flex items-center px-4 py-2 rounded hover:bg-[#dddddd] transition-all duration-300"
        >
          <div className="min-w-[20px] flex justify-center">
            <IoCubeOutline size={20} />
          </div>
          <span
            className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${
              isSidebarExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            Integrations
          </span>
        </Link>
        <div className="my-3 border-t border-brand-borders border-gray-400 opacity-50"></div>
        <Link
          to="/usage"
          className="flex items-center px-4 py-2 rounded hover:bg-[#dddddd] transition-all duration-300"
        >
          <div className="min-w-[20px] flex justify-center">
            <FiBarChart2 size={20} />
          </div>
          <span
            className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${
              isSidebarExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            Usage
          </span>
        </Link>
        <Link
          to="/billing"
          className="flex items-center px-4 py-2 rounded hover:bg-[#dddddd] transition-all duration-300"
        >
          <div className="min-w-[20px] flex justify-center">
            <TbFileInvoice size={20} />
          </div>
          <span
            className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${
              isSidebarExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            Billing
          </span>
        </Link>
        <div className="my-3 border-t border-brand-borders border-gray-400 opacity-50"></div>
        <Link
          to="/settings"
          className="flex items-center px-4 py-2 rounded hover:bg-[#dddddd] transition-all duration-300"
        >
          <div className="min-w-[20px] flex justify-center">
            <CiSettings size={20} />
          </div>
          <span
            className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${
              isSidebarExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            Settings
          </span>
        </Link>
        <a
          href="https://docs.hireremo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center px-4 py-2 rounded hover:bg-[#dddddd] transition-all duration-300"
        >
          <div className="min-w-[20px] flex justify-center">
            <GrDocumentText size={20} />
          </div>
          <span
            className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${
              isSidebarExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            Docs
          </span>
        </a>

        <Link
          to="/contact"
          className="flex items-center px-4 py-2 rounded hover:bg-[#dddddd] transition-all duration-300"
        >
          <div className="min-w-[20px] flex justify-center">
            <CiMail size={20} />
          </div>
          <span
            className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${
              isSidebarExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            Contact Us
          </span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
