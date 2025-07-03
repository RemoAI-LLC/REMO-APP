import React, { useState, useRef, useEffect } from "react";
import { IoChevronDownSharp, IoChevronUpSharp } from "react-icons/io5";
import { useLogin, useLogout, usePrivy } from "@privy-io/react-auth";

const Topbar: React.FC = () => {
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
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-600 text-white font-semibold text-sm uppercase">
                  {getUserInitial()}
                </div>
              )}
              {isUserDropdownOpen ? (
                <IoChevronUpSharp className="w-4 h-4" />
              ) : (
                <IoChevronDownSharp className="w-4 h-4" />
              )}
            </button>

            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 py-1 bg-[#fafafa] rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <span className="text-sm font-medium text-gray-500 px-4 py-2 block">
                  {getUserDisplayName()}
                </span>
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
