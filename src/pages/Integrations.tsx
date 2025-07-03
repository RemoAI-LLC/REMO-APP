// src/pages/Integrations.tsx
import React, { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import EmailStatusIndicator from "../components/EmailStatusIndicator";
import EmailSetupModal from "../components/EmailSetupModal";

const Integrations: React.FC = () => {
  const { user } = usePrivy();
  const userId = user?.id;
  console.log('[DEBUG] Integrations page user:', user);
  console.log('[DEBUG] Integrations page userId:', userId);
  const [showEmailSetup, setShowEmailSetup] = useState(false);
  const [emailConnected, setEmailConnected] = useState(false);

  const handleEmailSetupClick = () => {
    setShowEmailSetup(true);
  };

  const handleEmailSetupSuccess = () => {
    setEmailConnected(true);
  };

  const handleEmailSetupClose = () => {
    setShowEmailSetup(false);
    // Optionally, re-check status here
  };

  const handleDisconnect = () => {
    setEmailConnected(false);
    // You can add API call to disconnect here if needed
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Integrations</h1>
      {userId ? (
        <>
          <EmailStatusIndicator
            userId={userId}
            isConnected={emailConnected}
            onConnectClick={handleEmailSetupClick}
            onDisconnect={handleDisconnect}
          />
          <EmailSetupModal
            isOpen={showEmailSetup}
            onClose={handleEmailSetupClose}
            onSuccess={handleEmailSetupSuccess}
            userId={userId}
          />
        </>
      ) : (
        <p className="text-gray-600">Please log in to connect your Gmail account.</p>
      )}
      {!userId && (
        <div className="bg-yellow-100 text-yellow-800 rounded p-2 mt-4 text-sm">
          [DEBUG] No userId found. Privy user may not be loaded yet.
        </div>
      )}
    </div>
  );
};

export default Integrations;
