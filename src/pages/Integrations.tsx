import React, { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { FaGoogle } from "react-icons/fa";
import EmailSetupModal from "../components/EmailSetupModal";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Integrations: React.FC = () => {
  const { user } = usePrivy();
  const userId = user?.id;
  const [showEmailSetup, setShowEmailSetup] = useState(false);
  const [emailConnected, setEmailConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<any>(null);

  // Check authentication status on component mount and when userId changes
  useEffect(() => {
    if (userId) {
      checkAuthStatus();
    }
  }, [userId]);

  const checkAuthStatus = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/auth/status/${userId}`);
      const data = await response.json();
      setAuthStatus(data);
      setEmailConnected(data.authenticated);
    } catch (error) {
      console.error("Error checking auth status:", error);
      setEmailConnected(false);
    }
  };

  const handleEmailSetupClick = () => setShowEmailSetup(true);
  const handleEmailSetupSuccess = () => {
    setEmailConnected(true);
    checkAuthStatus(); // Refresh status after successful connection
  };
  const handleEmailSetupClose = () => setShowEmailSetup(false);

  const handleDisconnect = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout/${userId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setEmailConnected(false);
        setAuthStatus(null);
        // Optionally, show a toast or message
      } else {
        // Optionally, show an error message
        alert("Failed to disconnect Gmail. Please try again.");
      }
    } catch (error) {
      alert("Error disconnecting Gmail. Please try again.");
      console.error("Error disconnecting Gmail:", error);
    } finally {
      setIsLoading(false);
      checkAuthStatus();
    }
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-10">
      <h1 className="text-4xl font-bold mb-10 text-center">Integrations</h1>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md dark:shadow-[0_4px_20px_rgba(255,255,255,0.05)] hover:shadow-xl dark:hover:shadow-[0_6px_30px_rgba(255,255,255,0.1)] transition-all duration-300 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <FaGoogle size={32} className="text-gray-900 dark:text-gray-100" />
            <div className="px-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Gmail
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connect your Gmail to allow Remo AI to send emails, view
                reminders, and sync calendar events.
              </p>
            </div>
          </div>
          {userId ? (
            <button
              onClick={
                emailConnected ? handleDisconnect : handleEmailSetupClick
              }
              disabled={isLoading}
              className={`px-4 py-2 rounded-md text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                emailConnected
                  ? "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                  : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              }`}
            >
              {isLoading
                ? "Processing..."
                : emailConnected
                ? "Disconnect"
                : "Connect"}
            </button>
          ) : (
            <span className="text-sm text-gray-400 dark:text-gray-500">
              Please log in
            </span>
          )}
        </div>
        {/* Modal */}
        {userId && (
          <EmailSetupModal
            isOpen={showEmailSetup}
            onClose={handleEmailSetupClose}
            onSuccess={handleEmailSetupSuccess}
            userId={userId}
          />
        )}
       
      </div>
      {!userId && (
        <div className="text-yellow-500 dark:text-yellow-400 text-center mt-6 text-sm">
          [DEBUG] No userId found. Privy user may not be loaded yet.
        </div>
      )}
    </div>
  );
};

export default Integrations;
