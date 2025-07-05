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
import ContactUsModal from "../pages/ContactUs";
import { FaArrowUp } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";

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
  const [isContactModalOpen, setContactModalOpen] = useState(false);

  return (
    <div
      className={`transition-all duration-300 bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 fixed top-0 left-0 h-screen z-50 ${
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
          className="flex items-center px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
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
          className="flex items-center px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
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
        <div className="my-3 border-t border-gray-300 dark:border-gray-600 opacity-50"></div>
        <Link
          to="/usage"
          className="flex items-center px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
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
          className="flex items-center px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
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
        <div className="my-3 border-t border-gray-300 dark:border-gray-600 opacity-50"></div>
        <Link
          to="/settings"
          className="flex items-center px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
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
          className="flex items-center px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
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

        <button
          onClick={() => setContactModalOpen(true)}
          className="w-full flex items-center px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
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
        </button>

        {isContactModalOpen && (
          <ContactUsModal onClose={() => setContactModalOpen(false)} />
        )}
      </nav>
      {/* Upgrade Plan Link and Theme Toggle at the bottom */}
      <div className="px-2 pb-4 mt-auto space-y-2">
        {/* Theme Toggle */}
        <div className="flex items-center px-4 py-2">
          <div className="min-w-[20px] flex justify-center">
            <ThemeToggle />
          </div>
          <span
            className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${
              isSidebarExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            Theme
          </span>
        </div>
        <Link
          to="/upgrade"
          className="flex items-center px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 w-full"
        >
          <div className="min-w-[20px] flex justify-center">
            <FaArrowUp size={20} />
          </div>
          <span
            className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${
              isSidebarExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            Upgrade Plan
          </span>
        </Link>
        
        
      </div>
    </div>
  );
};

export default Sidebar;
