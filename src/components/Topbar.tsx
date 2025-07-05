import React, { useState, useRef, useEffect } from "react";
import { IoChevronDownSharp, IoChevronUpSharp } from "react-icons/io5";
import { useLogin, useLogout, usePrivy } from "@privy-io/react-auth";

interface TopbarProps {
  onMenuClick?: () => void;
  sidebarExpanded?: boolean;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick, sidebarExpanded = false }) => {
  const { authenticated, ready, user } = usePrivy();
  const { login } = useLogin();
  const { logout } = useLogout();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getUserDisplayName = () => {
    if (!user) return "";
    return (
      user.google?.name ||
      user.linkedin?.name ||
      user.twitter?.name ||
      user.discord?.username ||
      user.github?.name ||
      user.email?.address?.split("@")[0] ||
      "User"
    );
  };

  const getUserImage = (): string | null => {
    if (!user) return null;

    const imageSources = [user.twitter?.profilePictureUrl];

    for (const src of imageSources) {
      if (typeof src === "string" && src.trim() !== "") {
        return src;
      }
    }

    return null; // fallback to initials
  };

  const getUserInitial = (): string => {
    if (!user) return "?";

    const nameSources = [
      user.google?.name,
      user.linkedin?.name,
      user.twitter?.name,
      user.discord?.username,
      user.github?.name,
      user.email?.address?.split("@")[0],
    ];

    for (const name of nameSources) {
      if (typeof name === "string" && name.trim() !== "") {
        return name.trim().charAt(0).toUpperCase();
      }
    }

    return "?";
  };

  return (
    <header 
      className={`
        fixed top-0 right-0 h-16 z-50 flex items-center justify-between px-6 
        bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm
        transition-all duration-300
        left-0 lg:left-16
        ${sidebarExpanded ? 'lg:left-64' : ''}
      `}
    >
      {/* Hamburger menu for mobile */}
      <div className="relative group lg:hidden">
        <button
          className="mr-2 text-2xl text-gray-700 dark:text-gray-200 focus:outline-none hover:text-gray-900 dark:hover:text-white transition-colors"
          onClick={onMenuClick}
          aria-label="Open sidebar menu"
        >
          <span>&#9776;</span>
        </button>
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
          Open sidebar menu
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
      
      <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">REMO</h1>
      <div className="flex items-center gap-4">
        {ready && authenticated ? (
          <div className="relative" ref={dropdownRef}>
            <div className="relative group">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center space-x-2 text-white hover:text-gray-200 focus:outline-none"
              >
                {getUserImage() ? (
                  <img
                    src={getUserImage()!}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border border-white"
                  />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-600 text-white font-semibold text-sm uppercase">
                    {getUserInitial()}
                  </div>
                )}
                {isUserDropdownOpen ? (
                  <IoChevronUpSharp className="w-4 h-4 text-gray-900 dark:text-gray-100" />
                ) : (
                  <IoChevronDownSharp className="w-4 h-4 text-gray-900 dark:text-gray-100" />
                )}
              </button>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                User menu
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>

            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 px-4 py-2 block">
                  {getUserDisplayName()}
                </span>
                <div className="relative group">
                  <button
                    onClick={() => {
                      logout();
                      setIsUserDropdownOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                  >
                    Logout
                  </button>
                  {/* Tooltip */}
                  <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                    Sign out of your account
                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-r-4 border-l-0 border-t-4 border-b-4 border-transparent border-r-gray-900"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative group">
            <button
              onClick={() => login()}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Get Started
            </button>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
              Sign in to your account
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
