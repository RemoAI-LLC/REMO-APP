import React, { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { FaGoogle } from "react-icons/fa";
import EmailStatusIndicator from "../components/EmailStatusIndicator";
import EmailSetupModal from "../components/EmailSetupModal";

const Integrations: React.FC = () => {
  const { user } = usePrivy();
  const userId = user?.id;
  const [showEmailSetup, setShowEmailSetup] = useState(false);
  const [emailConnected, setEmailConnected] = useState(false);

  const handleEmailSetupClick = () => setShowEmailSetup(true);
  const handleEmailSetupSuccess = () => setEmailConnected(true);
  const handleEmailSetupClose = () => setShowEmailSetup(false);
  const handleDisconnect = () => setEmailConnected(false);

  return (
    <div className="min-h-screen bg-bg text-text p-10">
      <h1 className="text-4xl font-bold mb-10 text-text text-center">
        Integrations
      </h1>

      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between p-6  bg-[#fafafa] rounded-xl overflow-hidden shadow-md  dark:shadow-[0_4px_20px_rgba(255,255,255,0.05)] hover:shadow-xl dark:hover:shadow-[0_6px_30px_rgba(255,255,255,0.1)] transition-all duration-300 ">
          <div className="flex items-center space-x-4">
            <FaGoogle size={32} className="text-text" />
            <div className="px-4">
              <h2 className="text-lg font-semibold">Gmail</h2>
              <p className="text-sm text-text">
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
              className={`px-4 py-2 rounded-md transition ${
                emailConnected
                  ? "bg-red-500 hover:bg-red-500 transition-all duration-300 hover:scale-105"
                  : "bg-blue-500 hover:bg-blue-500 transition-all duration-300 hover:scale-105"
              }`}
            >
              {emailConnected ? "Disconnect" : "Connect"}
            </button>
          ) : (
            <span className="text-sm text-gray-400">Please log in</span>
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
        <div className="text-yellow-400 text-center mt-6 text-sm">
          [DEBUG] No userId found. Privy user may not be loaded yet.
        </div>
      )}
    </div>
  );
};

export default Integrations;
