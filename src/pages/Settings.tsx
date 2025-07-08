import React, { useState } from "react";
import { IoCog, IoDesktop, IoLink, IoPerson, IoColorPalette, IoNotifications, IoLanguage, IoShield } from "react-icons/io5";
import { usePrivy } from "@privy-io/react-auth";
import { useNavigate } from "react-router-dom";

type SettingsTab = "general" | "interfaces" | "integrations" | "account" | "appearance" | "notifications" | "privacy";

const Settings: React.FC = () => {
  const { user, logout } = usePrivy();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [settings, setSettings] = useState({
    // General settings
    language: "en",
    timezone: "UTC",
    autoSave: true,
    
    // Interface settings
    compactMode: false,
    showTimestamps: true,
    messageBubbleStyle: "rounded",
    
    // Appearance settings
    theme: "system",
    fontSize: "medium",
    colorScheme: "blue",
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: false,
    soundEnabled: true,
    
    // Privacy settings
    dataCollection: true,
    analytics: false,
    shareUsageData: false,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE_ACCOUNT") {
      alert("Please type 'DELETE_ACCOUNT' to confirm account deletion.");
      return;
    }

    setIsDeleting(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const stripeApiUrl = import.meta.env.VITE_STRIPE_API_URL || "http://localhost:3001";
      const userEmail = user?.email?.address;
      
      // Step 1: Cancel subscription first
      if (userEmail) {
        try {
          console.log("Cancelling subscription for:", userEmail);
          const subscriptionResponse = await fetch(`${stripeApiUrl}/api/cancel-subscription`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: userEmail
            }),
          });
          
          if (subscriptionResponse.ok) {
            const subscriptionResult = await subscriptionResponse.json();
            console.log("Subscription cancelled:", subscriptionResult);
          } else {
            const subscriptionError = await subscriptionResponse.json();
            console.warn("Failed to cancel subscription:", subscriptionError);
            // Continue with account deletion even if subscription cancellation fails
          }
        } catch (subscriptionError) {
          console.error("Error cancelling subscription:", subscriptionError);
          // Continue with account deletion even if subscription cancellation fails
        }
      }

      // Step 2: Delete user account
      console.log("Deleting account for user:", user?.id);
      const response = await fetch(`${API_BASE_URL}/account/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.id,
          confirmation: deleteConfirmation,
          reason: "User requested account deletion"
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Account deleted successfully. Your subscription has been cancelled and you will be logged out.");
        
        // Logout and redirect to pricing page
        await logout();
        navigate("/pricing");
      } else {
        const error = await response.json();
        alert(`Error deleting account: ${error.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Error deleting account. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setDeleteConfirmation("");
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: IoCog },
    { id: "interfaces", label: "Interfaces", icon: IoDesktop },
    { id: "appearance", label: "Appearance", icon: IoColorPalette },
    { id: "notifications", label: "Notifications", icon: IoNotifications },
    { id: "integrations", label: "Integrations", icon: IoLink },
    { id: "privacy", label: "Privacy", icon: IoShield },
    { id: "account", label: "Account", icon: IoPerson },
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">General Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange("language", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => handleSettingChange("timezone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Time</option>
              <option value="PST">Pacific Time</option>
              <option value="GMT">GMT</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Auto-save conversations</label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Automatically save your chat history</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => handleSettingChange("autoSave", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInterfaceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Interface Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Compact mode</label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Reduce spacing between messages</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.compactMode}
                onChange={(e) => handleSettingChange("compactMode", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Show timestamps</label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Display message timestamps</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showTimestamps}
                onChange={(e) => handleSettingChange("showTimestamps", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message bubble style</label>
            <select
              value={settings.messageBubbleStyle}
              onChange={(e) => handleSettingChange("messageBubbleStyle", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="rounded">Rounded</option>
              <option value="sharp">Sharp corners</option>
              <option value="pill">Pill shaped</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Appearance Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => handleSettingChange("theme", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="system">System default</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Font size</label>
            <select
              value={settings.fontSize}
              onChange={(e) => handleSettingChange("fontSize", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Color scheme</label>
            <div className="grid grid-cols-3 gap-3">
              {["blue", "green", "purple", "red", "orange", "pink"].map((color) => (
                <button
                  key={color}
                  onClick={() => handleSettingChange("colorScheme", color)}
                  className={`p-3 rounded-lg border-2 ${
                    settings.colorScheme === color
                      ? "border-blue-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full bg-${color}-500 mx-auto`}></div>
                  <span className="text-xs mt-1 capitalize">{color}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Email notifications</label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Receive notifications via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange("emailNotifications", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Push notifications</label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Receive browser push notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => handleSettingChange("pushNotifications", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Sound notifications</label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Play sound for new messages</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => handleSettingChange("soundEnabled", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrationsSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Integrations</h3>
        
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">G</span>
                </div>
                <div>
                  <h4 className="font-medium">Gmail</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Connect your Gmail account</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Connect
              </button>
            </div>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
                <div>
                  <h4 className="font-medium">Google Calendar</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Schedule meetings and events</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md">
                Coming Soon
              </button>
            </div>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <div>
                  <h4 className="font-medium">Slack</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Send messages to Slack channels</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md">
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Data collection</label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Allow us to collect usage data to improve the service</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.dataCollection}
                onChange={(e) => handleSettingChange("dataCollection", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Analytics</label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Help us improve by sharing anonymous usage statistics</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.analytics}
                onChange={(e) => handleSettingChange("analytics", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Share usage data</label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Share conversation data for AI model improvement</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.shareUsageData}
                onChange={(e) => handleSettingChange("shareUsageData", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
        
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.email?.address?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h4 className="font-medium">{user?.email?.address || "User"}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Connected account</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Display name</label>
            <input
              type="text"
              defaultValue={user?.google?.name || user?.linkedin?.name || "User"}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter display name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email address</label>
            <input
              type="email"
              defaultValue={user?.email?.address || ""}
              disabled
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
            />
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">Danger Zone</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
              </div>
              
              {!showDeleteConfirm ? (
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              ) : (
                <div className="space-y-4 p-4 border border-red-200 dark:border-red-800 rounded-md bg-red-50 dark:bg-red-900/20">
                  <div>
                    <h5 className="font-medium text-red-800 dark:text-red-200 mb-2">
                      Confirm Account Deletion
                    </h5>
                    <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                      This action cannot be undone. All your data will be permanently deleted.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                      Type "DELETE_ACCOUNT" to confirm:
                    </label>
                    <input
                      type="text"
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      className="w-full px-3 py-2 border border-red-300 dark:border-red-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="DELETE_ACCOUNT"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isDeleting || deleteConfirmation !== "DELETE_ACCOUNT"}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isDeleting ? "Deleting..." : "Delete Account"}
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteConfirmation("");
                      }}
                      className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
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
      case "interfaces":
        return renderInterfaceSettings();
      case "appearance":
        return renderAppearanceSettings();
      case "notifications":
        return renderNotificationSettings();
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

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h1>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id as SettingsTab)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings; 