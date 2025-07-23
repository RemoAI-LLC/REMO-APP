import React, { useState, useEffect } from "react";
import { FaEnvelope, FaEnvelopeOpenText } from "react-icons/fa";

interface EmailStatusIndicatorProps {
  userId: string;
  isConnected: boolean;
  onConnectClick: () => void;
  onDisconnect?: () => void;
}

interface AuthStatus {
  authenticated: boolean;
  scopes: string[];
  message: string;
}

const EmailStatusIndicator: React.FC<EmailStatusIndicatorProps> = ({
  userId,
  isConnected,
  onConnectClick,
  onDisconnect,
}) => {
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    if (userId) {
      checkAuthStatus();
    }
  }, [userId]);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      console.log(
        "[DEBUG] EmailStatusIndicator checking auth status for userId:",
        userId
      );
      const response = await fetch(`${API_BASE_URL}/auth/status/${userId}`);
      const data = await response.json();
      console.log("[DEBUG] /auth/status response:", data);
      setAuthStatus(data);
    } catch (err) {
      console.error("[DEBUG] Failed to check email auth status:", err);
      setAuthStatus({
        authenticated: false,
        scopes: [],
        message: "Failed to check status",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="text-xs">Checking email...</span>
      </div>
    );
  }

  if (!authStatus) {
    return null;
  }

  if (isConnected || authStatus.authenticated) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md w-full border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <FaEnvelopeOpenText className="text-green-600 dark:text-green-400 text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Gmail Connected
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Email integration active
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Connected Services:
            </h4>
            <div className="space-y-1">
              {authStatus.scopes.includes(
                "https://www.googleapis.com/auth/gmail.modify"
              ) && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Send & manage emails
                  </span>
                </div>
              )}
              {authStatus.scopes.includes(
                "https://www.googleapis.com/auth/calendar"
              ) && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Calendar access
                  </span>
                </div>
              )}
              {authStatus.scopes.includes(
                "https://www.googleapis.com/auth/calendar.events"
              ) && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Schedule meetings
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onConnectClick}
              className="flex-1 bg-blue-600 dark:bg-blue-500 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Settings
            </button>
            <button
              onClick={onDisconnect || (() => {})}
              className="flex-1 bg-red-600 dark:bg-red-500 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onConnectClick}
      className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
      title="Connect Gmail for email features"
    >
      <FaEnvelope className="text-sm" />
      <span className="text-xs font-medium">Connect Gmail</span>
    </button>
  );
};

export default EmailStatusIndicator;
