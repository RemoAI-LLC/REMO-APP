import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaGoogle, FaTimes, FaCheck, FaSpinner } from 'react-icons/fa';

interface EmailSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

interface AuthStatus {
  authenticated: boolean;
  scopes: string[];
  message: string;
}

const EmailSetupModal: React.FC<EmailSetupModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userId
}) => {
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Check authentication status when modal opens
  useEffect(() => {
    if (isOpen && userId) {
      checkAuthStatus();
    }
  }, [isOpen, userId]);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/status/${userId}`);
      const data = await response.json();
      
      setAuthStatus(data);
      
      if (data.authenticated) {
        // Auto-close modal if already authenticated
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      }
    } catch (err) {
      setError('Failed to check authentication status');
      console.error('Auth status check error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const initiateOAuth = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google/login?user_id=${encodeURIComponent(userId)}`);
      const data = await response.json();
      
      if (data.authorization_url) {
        // Open OAuth URL in new window
        const authWindow = window.open(
          data.authorization_url,
          'gmail-auth',
          'width=500,height=600,scrollbars=yes,resizable=yes'
        );
        
        // Poll for completion
        const pollInterval = setInterval(async () => {
          try {
            const statusResponse = await fetch(`${API_BASE_URL}/auth/status/${userId}`);
            const statusData = await statusResponse.json();
            
            if (statusData.authenticated) {
              clearInterval(pollInterval);
              setAuthStatus(statusData);
              setIsConnecting(false);
              
              // Close auth window
              if (authWindow) {
                authWindow.close();
              }
              
              // Show success and close modal
              setTimeout(() => {
                onSuccess();
                onClose();
              }, 2000);
            }
          } catch (err) {
            console.error('Status check error:', err);
          }
        }, 2000);
        
        // Timeout after 5 minutes
        setTimeout(() => {
          clearInterval(pollInterval);
          if (authWindow) {
            authWindow.close();
          }
          setIsConnecting(false);
          setError('Authentication timed out. Please try again.');
        }, 300000);
        
      } else {
        throw new Error('Failed to get authorization URL');
      }
    } catch (err) {
      setError('Failed to initiate Gmail connection');
      console.error('OAuth initiation error:', err);
      setIsConnecting(false);
    }
  };

  const disconnectGmail = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout/${userId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setAuthStatus({
          authenticated: false,
          scopes: [],
          message: 'Disconnected from Gmail'
        });
      } else {
        throw new Error('Failed to disconnect');
      }
    } catch (err) {
      setError('Failed to disconnect Gmail');
      console.error('Disconnect error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <FaEnvelope className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Gmail & Calendar Setup
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Connect your Google account for email and calendar features
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <FaSpinner className="animate-spin text-blue-500 text-2xl" />
              <span className="ml-3 text-gray-600 dark:text-gray-300">
                Checking connection...
              </span>
            </div>
          ) : authStatus?.authenticated ? (
            /* Connected State */
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <FaCheck className="text-green-500 text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Gmail & Calendar Connected!
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  You can now use email and calendar features in chat
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  <strong>Access granted:</strong> Read, send, and manage emails + Create calendar events
                </p>
              </div>
              <button
                onClick={disconnectGmail}
                className="w-full px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                Disconnect Gmail
              </button>
            </div>
          ) : (
            /* Not Connected State */
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaGoogle className="text-blue-500 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Connect Your Google Account
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Securely connect your Google account to enable email and calendar features in chat
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  What you can do:
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Compose and send emails</li>
                  <li>• Schedule emails for later</li>
                  <li>• Search and organize emails</li>
                  <li>• Get email summaries</li>
                  <li>• Create calendar events</li>
                  <li>• Schedule meetings with invites</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Security & Privacy:
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• OAuth 2.0 secure authentication</li>
                  <li>• No passwords stored in chat</li>
                  <li>• You can disconnect anytime</li>
                  <li>• Data stays in your Gmail account</li>
                </ul>
              </div>
              
              <button
                onClick={initiateOAuth}
                disabled={isConnecting}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition"
              >
                {isConnecting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <FaGoogle />
                    <span>Connect with Google</span>
                  </>
                )}
              </button>
            </div>
          )}
          
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailSetupModal; 