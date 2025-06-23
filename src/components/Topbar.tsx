import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoChevronDownSharp, IoChevronUpSharp } from "react-icons/io5";
import { useLogin, useLogout, usePrivy } from "@privy-io/react-auth"; // <-- update import

const Topbar: React.FC = () => {
  const { authenticated, ready, user } = usePrivy();
  const { login } = useLogin(); // <-- get login from Privy hook
  const { logout } = useLogout(); // <-- get logout from Privy hook
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
    if (user.google?.name) return user.google.name;
    if (user.discord?.username) return user.discord.username;
    if (user.twitter?.name) return user.twitter.name;
    if (user.github?.name) return user.github.name;
    if (user.email?.address) return user.email.address.split("@")[0];
    return "User";
  };

  const getUserImage = () => {
    return "";
  };

  return (
    <header className="w-full h-16 bg-gray-900 text-white border-b border-gray-700 z-40 flex items-center justify-between px-6">
      <h1 className="text-lg font-bold text-white">REMO</h1>
      <div className="flex items-center gap-4">
        {ready && authenticated ? (
          <div className="relative" ref={dropdownRef}>
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
                <FaUserCircle className="w-6 h-6" />
              )}
              <span className="text-sm font-medium">
                {getUserDisplayName()}
              </span>
              {isUserDropdownOpen ? (
                <IoChevronUpSharp className="w-4 h-4" />
              ) : (
                <IoChevronDownSharp className="w-4 h-4" />
              )}
            </button>

            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 py-1 bg-[#fafafa] rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <button
                  onClick={() => {
                    logout();
                    setIsUserDropdownOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => login()}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Get Started
          </button>
        )}
      </div>
    </header>
  );
};

export default Topbar;
