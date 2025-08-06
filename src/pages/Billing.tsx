import React, { useState } from "react";
import { useAccess } from "../context/AccessContext";
import {
  FaCreditCard,
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
  FaExternalLinkAlt,
} from "react-icons/fa";
import LoadingScreen from "../components/LoadingScreen";

interface BillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BillingModal: React.FC<BillingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [portalUrl, setPortalUrl] = useState<string | null>(null);
  const [showPortalLink, setShowPortalLink] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const STRIPE_BACKEND_URL =
        import.meta.env.VITE_STRIPE_BACKEND_URL ||
        (window.location.hostname === "localhost"
          ? "http://localhost:3001"
          : "https://stripe-backend-4ian.onrender.com");

      const response = await fetch(
        `${STRIPE_BACKEND_URL}/api/send-portal-link`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // If portal URL is provided (fallback case), show it
        if (data.portalUrl) {
          setPortalUrl(data.portalUrl);
          setShowPortalLink(true);
        } else {
          // Email was sent successfully, close modal after delay
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 2000);
        }
      } else {
        setError(data.error || "Failed to send portal link");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Manage Subscription
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <FaTimesCircle className="w-5 h-5" />
          </button>
        </div>

        {!success ? (
          <>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Enter your email address to receive a secure link to manage your
              subscription.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="your@email.com"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm">
                  <FaTimesCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center relative"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoadingScreen 
                        isVisible={isLoading}
                        message="Sending..."
                        variant="inline"
                        size="small"
                        showLogo={false}
                      />
                    </>
                  ) : (
                    <>
                      <FaEnvelope className="w-4 h-4 mr-2" />
                      Send Link
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center">
            <FaCheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {showPortalLink ? "Portal Link Generated!" : "Link Sent!"}
            </h4>
            {showPortalLink ? (
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Email delivery failed, but you can use the portal link
                  directly:
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                  <a
                    href={portalUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 break-all"
                  >
                    {portalUrl}
                  </a>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This link will expire in 24 hours.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                  <a
                    href={portalUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <FaExternalLinkAlt className="w-4 h-4 mr-2" />
                    Open Portal
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Check your email for the subscription management link.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Billing: React.FC = () => {
  const { subscription } = useAccess();
  const [showModal, setShowModal] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPlanDetails = () => {
    if (!subscription) return null;

    const planType = subscription.type;
    if (!planType) return null;
    const isYearly = planType.includes("Yearly");
    const isBasic = planType.includes("Basic");

    return {
      name: planType,
      tier: isBasic ? "Basic" : "Premium",
      billing: isYearly ? "Yearly" : "Monthly",
      price: isBasic
        ? isYearly
          ? "$215.89/year"
          : "$19.99/month"
        : isYearly
        ? "$539.98/year"
        : "$49.99/month",
      nextBilling: subscription.current_period_end
        ? formatDate(subscription.current_period_end)
        : null,
    };
  };

  const planDetails = getPlanDetails();

  const handleManageSubscription = () => {
    setShowModal(true);
  };

  const handleModalSuccess = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Billing & Subscription
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your subscription, billing information, and payment methods.
          </p>
        </div>

        {/* Current Plan Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Current Plan
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                subscription?.status === "active"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              }`}
            >
              {subscription?.status === "active"
                ? "Active"
                : subscription?.status}
            </span>
          </div>

          {planDetails ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  {planDetails.name}
                </h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {planDetails.price}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {planDetails.billing} billing
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Next Billing Date
                </h4>
                <p className="text-gray-900 dark:text-white">
                  {planDetails.nextBilling || "N/A"}
                </p>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleManageSubscription}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <FaExternalLinkAlt className="w-4 h-4 mr-2" />
                  Manage Subscription
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No active subscription found.
              </p>
              <a
                href="/upgrade"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <FaCreditCard className="w-4 h-4 mr-2" />
                Upgrade Plan
              </a>
            </div>
          )}
        </div>

        {/* Billing History */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Billing History
            </h2>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
              Download All
            </button>
          </div>

          {subscription ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {planDetails?.name} - {planDetails?.billing}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {planDetails?.nextBilling}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {planDetails?.price}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Paid
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No billing history available.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Manage Subscription Modal */}
      <BillingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default Billing;
