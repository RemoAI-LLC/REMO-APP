import React, { useState, useEffect } from "react";
import {
  IoClose,
  IoCog,
  IoLink,
  IoPerson,
  IoColorPalette,
  IoShield,
  IoChevronForward,
} from "react-icons/io5";
import { usePrivy } from "@privy-io/react-auth";
import { FaGoogle } from "react-icons/fa";
import { useFontSize } from "../context/FontSizeContext";

// Helper to set theme on <html>
const setTheme = (theme: string) => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab =
  | "general"
  | "integrations"
  | "account"
  | "appearance"
  | "privacy";

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { user, logout } = usePrivy();
  const { fontSize, setFontSize } = useFontSize();
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [settings, setSettings] = useState({
    // General settings
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // User's current timezone
    autoSave: true,

    // Appearance settings
    theme: "system",
  });

  // Integration states
  const [emailConnected, setEmailConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  // Check email connection status
  useEffect(() => {
    if (user?.id) {
      checkAuthStatus();
    }
  }, [user?.id]);

  const checkAuthStatus = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`${API_BASE_URL}/auth/status/${user.id}`);
      const data = await response.json();
      setEmailConnected(data.authenticated);
    } catch (error) {
      console.error("Error checking auth status:", error);
      setEmailConnected(false);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) return;

    // Show detailed warning modal instead of simple confirm
    setShowDeleteWarning(true);
  };

  const confirmDeleteAccount = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const stripeApiUrl = import.meta.env.VITE_STRIPE_API_URL;
      const userEmail = user?.email?.address;
      // Use new endpoint: DELETE /api/user-subscriptions/:email
      if (userEmail) {
        try {
          console.log("Cancelling all subscriptions for:", userEmail);
          const cancelSubsResponse = await fetch(
            `${stripeApiUrl}/api/user-subscriptions/${encodeURIComponent(
              userEmail
            )}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (cancelSubsResponse.ok) {
            console.log("All subscriptions cancelled:");
          } else {
            const error = await cancelSubsResponse.json();
            console.warn("Failed to cancel all subscriptions:", error);
            // Continue with frontend account deletion even if backend fails
          }
        } catch (cancelError) {
          console.error("Error cancelling all subscriptions:", cancelError);
          // Continue with frontend account deletion even if backend fails
        }
      }

      // Step 2: Delete user account in your own backend (if needed)
      console.log("Deleting account for user:", user.id);
      const response = await fetch(`${API_BASE_URL}/account/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          confirmation: "DELETE_ACCOUNT",
          reason: "User requested account deletion",
        }),
      });

      if (response.ok) {
        alert(
          "Account deleted successfully. Your subscription has been cancelled and you will be logged out."
        );
        // Logout user and redirect
        logout();
        onClose();
        setShowDeleteWarning(false);
      } else {
        const error = await response.json();
        alert(`Failed to delete account: ${error.detail || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error deleting account. Please try again.");
    } finally {
      setIsLoading(false);
      setShowDeleteWarning(false);
    }
  };

  const handleDisconnectGmail = async () => {
    if (!user?.id) return;

    const confirmed = window.confirm(
      "Are you sure you want to disconnect Gmail? This will remove access to email features."
    );

    if (!confirmed) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout/${user.id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        setEmailConnected(false);
        alert("Gmail disconnected successfully");
      } else {
        alert("Failed to disconnect Gmail. Please try again.");
      }
    } catch (error) {
      console.error("Error disconnecting Gmail:", error);
      alert("Error disconnecting Gmail. Please try again.");
    } finally {
      setIsLoading(false);
      checkAuthStatus(); // Refresh status
    }
  };

  const tabs = [
    {
      id: "general",
      label: "General",
      icon: IoCog,
      description: "Basic preferences",
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: IoColorPalette,
      description: "Theme and styling",
    },
    {
      id: "integrations",
      label: "Integrations",
      icon: IoLink,
      description: "Connected services",
    },
    {
      id: "privacy",
      label: "Privacy",
      icon: IoShield,
      description: "Data and security",
    },
    {
      id: "account",
      label: "Account",
      icon: IoPerson,
      description: "Profile settings",
    },
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="bg-bg dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
          <IoCog className="mr-3 text-blue-600" size={24} />
          General Settings
        </h3>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-white">
              Timezone
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => handleSettingChange("timezone", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
              <option value="Asia/Tokyo">Tokyo</option>
              <option value="Asia/Shanghai">Shanghai</option>
              <option value="Australia/Sydney">Sydney</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Current timezone:{" "}
              {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-900 dark:text-white">
                  Auto-save conversations
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Automatically save your chat history
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={(e) =>
                    handleSettingChange("autoSave", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="bg-bg dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
          <IoColorPalette className="mr-3 text-green-600" size={24} />
          Appearance Settings
        </h3>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-900 dark:text-white">
                  Theme
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Switch between Light and Dark mode
                </p>
              </div>
              <div className="flex space-x-2">
                {["light", "dark", "system"].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => {
                      handleSettingChange("theme", theme);
                      if (theme !== "system") setTheme(theme);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      settings.theme === theme
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-white">
              Font size
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["small", "medium", "large"].map((size) => (
                <button
                  key={size}
                  onClick={() =>
                    setFontSize(size as "small" | "medium" | "large")
                  }
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    fontSize === size
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrationsSettings = () => (
    <div className="space-y-6">
      <div className="bg-bg dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
          <IoLink className="mr-3 text-indigo-600" size={24} />
          Integrations
        </h3>

        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <FaGoogle className="text-white text-lg" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Gmail
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Connect your Gmail account for email features
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {emailConnected ? (
                  <button
                    onClick={handleDisconnectGmail}
                    disabled={isLoading}
                    className="px-3 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Disconnecting..." : "Disconnect"}
                  </button>
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Not connected
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="bg-bg dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
          <IoShield className="mr-3 text-red-600" size={24} />
          Privacy Settings
        </h3>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-900 dark:text-white">
                  Data collection
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Allow us to collect usage data to improve the service
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-indigo-600"></div>
              </label>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-900 dark:text-white">
                  Analytics
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Help us improve by sharing anonymous usage statistics
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={false}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-indigo-600"></div>
              </label>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-900 dark:text-white">
                  Share usage data
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Share conversation data for AI model improvement
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={false}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div className="bg-bg dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
          <IoPerson className="mr-3 text-gray-600" size={24} />
          Account Settings
        </h3>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {user?.email?.address?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user?.email?.address || "User"}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Connected account
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-white">
              Display name
            </label>
            <input
              type="text"
              defaultValue={
                user?.google?.name || user?.linkedin?.name || "User"
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter display name"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-white">
              Email address
            </label>
            <input
              type="email"
              defaultValue={user?.email?.address || ""}
              disabled
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-red-200 dark:border-red-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-red-700 dark:text-red-400">
                  Danger Zone
                </h4>
                <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                  Permanently delete your account and all data
                </p>
              </div>
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralSettings();
      case "appearance":
        return renderAppearanceSettings();
      case "integrations":
        return renderIntegrationsSettings();
      case "privacy":
        return renderPrivacySettings();
      case "account":
        return renderAccountSettings();
      default:
        return renderGeneralSettings();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Delete Account Warning Modal */}
      {showDeleteWarning && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => setShowDeleteWarning(false)}
          />

          <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-red-200 dark:border-red-800 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <IoShield
                  className="text-red-600 dark:text-red-400"
                  size={32}
                />
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Delete Account
              </h3>

              <div className="text-left space-y-4 mb-6">
                <p className="text-gray-600 dark:text-gray-300">
                  This action will permanently delete your account and all
                  associated data. This cannot be undone.
                </p>

                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                    What will happen:
                  </h4>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    <li>• Your subscription will be cancelled immediately</li>
                    <li>• All your conversations will be deleted</li>
                    <li>• All your reminders and todos will be removed</li>
                    <li>• Your Gmail connection will be disconnected</li>
                    <li>• Your account profile will be permanently deleted</li>
                    <li>• You will be logged out immediately</li>
                  </ul>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteWarning(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAccount}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 border border-transparent rounded-lg hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Settings Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Enhanced overlay with better glass morphism */}
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-md transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        />

        {/* Modal content with modern design */}
        <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all max-w-5xl w-full mx-4 border border-white/20 dark:border-gray-700/50">
          <div className="flex h-[700px] max-h-[90vh]">
            {/* Enhanced sidebar */}
            <div className="w-72 bg-gradient-to-b from-gray-50/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm border-r border-gray-200/50 dark:border-gray-700/50">
              <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Settings
                  </h2>
                  <div className="relative group">
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <IoClose size={20} />
                    </button>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                      Close settings
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
              </div>
              <nav className="p-4">
                <ul className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <li key={tab.id}>
                        <button
                          onClick={() => setActiveTab(tab.id as SettingsTab)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                            activeTab === tab.id
                              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          <Icon size={18} />
                          <div className="flex-1 text-left">
                            <div>{tab.label}</div>
                            <div
                              className={`text-xs ${
                                activeTab === tab.id
                                  ? "text-blue-100"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {tab.description}
                            </div>
                          </div>
                          <IoChevronForward size={14} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            {/* Content area */}
            <div className="flex-1 p-8 overflow-y-auto">{renderContent()}</div>
          </div>

          {/* Enhanced footer */}
          <div className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm px-8 py-4 border-t border-gray-200/50 dark:border-gray-700/50 flex justify-end space-x-3">
            <div className="relative group">
              <button
                onClick={onClose}
                className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                Discard changes and close
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
            <div className="relative group">
              <button
                onClick={() => {
                  // Save settings logic here
                  onClose();
                }}
                className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 border border-transparent rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
              >
                Save Changes
              </button>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                Save all changes
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsModal;
