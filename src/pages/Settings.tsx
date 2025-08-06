import React, { useState, useEffect } from "react";
import {
  IoCog,
  IoPerson,
  IoShield,
  IoWarning,
} from "react-icons/io5";
import { usePrivy } from "@privy-io/react-auth";
import { useFontSize } from "../context/FontSizeContext";
import LoadingScreen from "../components/LoadingScreen";

const Settings: React.FC = () => {
  const { user, logout } = usePrivy();
  const { fontSize, setFontSize } = useFontSize();
  const [settings, setSettings] = useState({
    // General settings
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    autoSave: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) return;
    setShowDeleteWarning(true);
  };

  const confirmDeleteAccount = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/user/${user.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        logout();
      } else {
        console.error("Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsLoading(false);
      setShowDeleteWarning(false);
    }
  };

  const renderGeneralSettings = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <IoCog className="text-gray-600 dark:text-gray-400" size={24} />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          General
        </h3>
      </div>
      <div className="space-y-6">
       
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Font Size
          </label>
                      <div className="flex items-center space-x-4">
              <button
                onClick={() => setFontSize("small")}
                className={`px-3 py-1 rounded text-sm ${
                  fontSize === "small"
                    ? "bg-black text-white"
                    : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300   text-gray-700 dark:text-gray-300"
                }`}
              >
                Small
              </button>
              <button
                onClick={() => setFontSize("medium")}
                className={`px-3 py-1 rounded text-sm ${
                  fontSize === "medium"
                    ? "bg-black text-white"
                    : "bg-gray-200 dark:bg-gray-700  hover:bg-gray-300  text-gray-700 dark:text-gray-300"
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => setFontSize("large")}
                className={`px-3 py-1 rounded text-sm ${
                  fontSize === "large"
                    ? "bg-black text-white"
                    : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300  text-gray-700 dark:text-gray-300"
                }`}
              >
                Large
              </button>
            </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Auto-save
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Automatically save your work
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) => handleSettingChange("autoSave", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:bg-black peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <IoShield className="text-gray-600 dark:text-gray-400" size={24} />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Privacy & Security
        </h3>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <div>
            <h5 className="font-medium text-gray-900 dark:text-white">
              Data collection
            </h5>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Allow us to collect usage data to improve the service
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={true}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:bg-black peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <div>
            <h5 className="font-medium text-gray-900 dark:text-white">
              Analytics
            </h5>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Help us improve by sharing anonymous usage statistics
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={false}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:bg-black peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <IoPerson className="text-gray-600 dark:text-gray-400" size={24} />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Account
        </h3>
      </div>
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white">
                User ID
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user?.id || "Not available"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white">
                Email
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user?.email?.address || "Not available"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-400">
                Danger Zone
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Permanently delete your account and all data
              </p>
            </div>
            <button
              onClick={handleDeleteAccount}
              disabled={isLoading}
              className="px-6 py-2 bg-transparent text-red-600 border border-red-500 rounded-lg hover:bg-gray-300 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed relative"
            >
              {isLoading ? (
                <>
                  <LoadingScreen 
                    isVisible={isLoading}
                    message="Deleting..."
                    variant="inline"
                    size="small"
                    showLogo={false}
                  />
                </>
              ) : (
                "Delete Account"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account preferences and integrations
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {renderGeneralSettings()}
          {renderPrivacySettings()}
          {renderAccountSettings()}
        </div>
      </div>

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
                <IoWarning
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
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 border border-transparent rounded-lg hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative"
                >
                  {isLoading ? (
                    <>
                      <LoadingScreen 
                        isVisible={isLoading}
                        message="Deleting..."
                        variant="inline"
                        size="small"
                        showLogo={false}
                      />
                    </>
                  ) : (
                    "Delete Account"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
