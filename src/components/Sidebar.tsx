import React, { useState, useEffect } from "react";
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
import { FaArrowUp } from "react-icons/fa";
import { FaTachometerAlt } from "react-icons/fa";
import ContactUsModal from "../pages/ContactUs";
import SettingsModal from "./SettingsModal";
import ThemeToggle from "./ThemeToggle";

interface SidebarProps {
  onExpandChange: (expanded: boolean) => void;
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onExpandChange, open }) => {
  const [hovering, setHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseEnter = () => {
    // Only expand on desktop (lg: and above)
    if (!isMobile) {
      setHovering(true);
      onExpandChange(true);
    }
  };

  const handleMouseLeave = () => {
    // Only collapse on desktop (lg: and above)
    if (!isMobile) {
      setHovering(false);
      onExpandChange(false);
    }
  };

  const isSidebarExpanded = hovering;
  const [isContactModalOpen, setContactModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);

  // Determine if sidebar should be expanded
  const shouldExpand = isMobile ? open : isSidebarExpanded;

  return (
    <>
      <div
        className={`
          fixed top-0 left-0 h-screen z-50
          transition-all duration-300
          bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100
          ${shouldExpand ? "w-64" : "w-16"}
          flex flex-col
          ${open ? "block" : "hidden"} lg:block
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Overlay to hide border behind logo */}
        <div
          className={`absolute left-0 top-0 z-10 transition-all duration-300`}
          style={{
            width: shouldExpand ? "16rem" : "4rem", // w-64 or w-16
            height: "4rem", // match logo section height (h-16)
            background: "inherit",
          }}
        />
        {/* Logo */}
        <div className="h-16 flex items-center px-3 transition-all duration-300 flex-shrink-0 relative z-20">
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-auto transition-all rounded-full duration-300"
            />
            <span
              className={`ml-3 whitespace-nowrap transition-opacity duration-200 font-bold text-lg text-gray-900 dark:text-gray-100 lg:hidden ${
                shouldExpand ? "opacity-100" : "opacity-0"
              }`}
            >
              REMO
            </span>
          </Link>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 px-2 py-4 pb-32 space-y-2 overflow-y-auto min-h-0">
          <div className="relative group">
            <Link
              to="/dashboard"
              className="flex items-center px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
            >
              <div className="min-w-[20px] flex justify-center">
                <FaTachometerAlt size={20} />
              </div>
              <span
                className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${
                  shouldExpand ? "opacity-100" : "opacity-0"
                }`}
              >
                Dashboard
              </span>
            </Link>
            {/* Tooltip */}
            <div
              className={`absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 ${
                shouldExpand ? "hidden" : "block"
              }`}
            >
              Dashboard
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-r-4 border-l-0 border-t-4 border-b-4 border-transparent border-r-gray-900"></div>
            </div>
          </div>

          <div className="relative group">
            <Link
              to="/usecases"
              className="flex items-center px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
            >
              <div className="min-w-[20px] flex justify-center">
                <IoGridOutline size={20} />
              </div>
              <span
                className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${
                  shouldExpand ? "opacity-100" : "opacity-0"
                }`}
              >
                Explore Use cases
              </span>
            </Link>
            {/* Tooltip */}
            <div
              className={`absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 ${
                shouldExpand ? "hidden" : "block"
              }`}
            >
              Explore Use cases
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-r-4 border-l-0 border-t-4 border-b-4 border-transparent border-r-gray-900"></div>
            </div>
          </div>

          <div className="relative group">
            <Link
              to="/integrations"
              className="flex items-center px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
            >
              <div className="min-w-[20px] flex justify-center">
                <IoCubeOutline size={20} />
              </div>
              <span
                className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${
                  shouldExpand ? "opacity-100" : "opacity-0"
                }`}
              >
                Integrations
              </span>
            </Link>
            {/* Tooltip */}
            <div
              className={`absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 ${
                shouldExpand ? "hidden" : "block"
              }`}
            >
              Integrations
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-r-4 border-l-0 border-t-4 border-b-4 border-transparent border-r-gray-900"></div>
            </div>
          </div>

          <div className="my-3 border-t border-gray-300 dark:border-gray-600 opacity-50"></div>

          <div className="relative group">
            <Link
              to="/usage"
              className="flex items-center px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
            >
              <div className="min-w-[20px] flex justify-center">
                <FiBarChart2 size={20} />
              </div>
              <span
                className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${
                  shouldExpand ? "opacity-100" : "opacity-0"
                }`}
              >
                Usage
              </span>
            </Link>
            {/* Tooltip */}
            <div
              className={`absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 ${
                shouldExpand ? "hidden" : "block"
              }`}
            >
              Usage
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-r-4 border-l-0 border-t-4 border-b-4 border-transparent border-r-gray-900"></div>
            </div>
          </div>

          <div className="relative group">
            <Link
              to="/billing"
              className="flex items-center px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
            >
              <div className="min-w-[20px] flex justify-center">
                <TbFileInvoice size={20} />
              </div>
              <span
                className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${
                  shouldExpand ? "opacity-100" : "opacity-0"
                }`}
              >
                Billing
              </span>
            </Link>
            {/* Tooltip */}
            <div
              className={`absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 ${
                shouldExpand ? "hidden" : "block"
              }`}
            >
              Billing
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-r-4 border-l-0 border-t-4 border-b-4 border-transparent border-r-gray-900"></div>
            </div>
          </div>

          <div className="my-3 border-t border-gray-300 dark:border-gray-600 opacity-50"></div>

          <div className="relative group">
            <button
              onClick={() => setSettingsModalOpen(true)}
              className="w-full flex items-center px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
            >
              <div className="min-w-[20px] flex justify-center">
                <CiSettings size={20} />
              </div>
              <span
                className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${
                  shouldExpand ? "opacity-100" : "opacity-0"
                }`}
              >
                Settings
              </span>
            </button>
            {/* Tooltip */}
            <div
              className={`absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 ${
                shouldExpand ? "hidden" : "block"
              }`}
            >
              Settings
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-r-4 border-l-0 border-t-4 border-b-4 border-transparent border-r-gray-900"></div>
            </div>
          </div>

          <div className="relative group">
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
                  shouldExpand ? "opacity-100" : "opacity-0"
                }`}
              >
                Docs
              </span>
            </a>
            {/* Tooltip */}
            <div
              className={`absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 ${
                shouldExpand ? "hidden" : "block"
              }`}
            >
              Documentation
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-r-4 border-l-0 border-t-4 border-b-4 border-transparent border-r-gray-900"></div>
            </div>
          </div>

          <div className="relative group">
            <button
              onClick={() => setContactModalOpen(true)}
              className="w-full flex items-center px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
            >
              <div className="min-w-[20px] flex justify-center">
                <CiMail size={20} />
              </div>
              <span
                className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${
                  shouldExpand ? "opacity-100" : "opacity-0"
                }`}
              >
                Contact Us
              </span>
            </button>
            {/* Tooltip */}
            <div
              className={`absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 ${
                shouldExpand ? "hidden" : "block"
              }`}
            >
              Contact Us
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-r-4 border-l-0 border-t-4 border-b-4 border-transparent border-r-gray-900"></div>
            </div>
          </div>

          {isContactModalOpen && (
            <ContactUsModal onClose={() => setContactModalOpen(false)} />
          )}
          {isSettingsModalOpen && (
            <SettingsModal
              isOpen={isSettingsModalOpen}
              onClose={() => setSettingsModalOpen(false)}
            />
          )}
        </nav>

        {/* Fixed Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 px-2 pb-4 space-y-2 flex-shrink-0 border-t border-gray-200 dark:border-gray-700 pt-4 bg-white dark:bg-gray-800">
          {/* Theme Toggle */}
          <div className="relative group">
            <div className="flex items-center px-4 py-2">
              <div className="min-w-[20px] flex justify-center">
                <ThemeToggle />
              </div>
              <span
                className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${
                  shouldExpand ? "opacity-100" : "opacity-0"
                }`}
              >
                Theme
              </span>
            </div>
            {/* Tooltip */}
            <div
              className={`absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 ${
                shouldExpand ? "hidden" : "block"
              }`}
            >
              Theme Toggle
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-r-4 border-l-0 border-t-4 border-b-4 border-transparent border-r-gray-900"></div>
            </div>
          </div>

          <div className="relative group">
            <Link
              to="/upgrade"
              className="flex items-center px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 w-full"
            >
              <div className="min-w-[20px] flex justify-center">
                <FaArrowUp size={20} />
              </div>
              <span
                className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${
                  shouldExpand ? "opacity-100" : "opacity-0"
                }`}
              >
                Upgrade Plan
              </span>
            </Link>
            {/* Tooltip */}
            <div
              className={`absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 ${
                shouldExpand ? "hidden" : "block"
              }`}
            >
              Upgrade Plan
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-r-4 border-l-0 border-t-4 border-b-4 border-transparent border-r-gray-900"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
