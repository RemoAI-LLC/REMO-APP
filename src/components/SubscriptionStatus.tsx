import React from "react";
import { useAccess } from "../context/AccessContext";

interface SubscriptionStatusProps {
  showDetails?: boolean;
  className?: string;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({
  showDetails = false,
  className = "",
}) => {
  const { subscription, isSubscriptionActive, getSubscriptionStatusMessage } =
    useAccess();

  if (!subscription) {
    return (
      <div className={`text-gray-500 ${className}`}>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          No Subscription
        </span>
      </div>
    );
  }

  const isActive = isSubscriptionActive(subscription.status);
  const statusMessage = getSubscriptionStatusMessage(subscription.status);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "trialing":
        return "bg-blue-100 text-blue-800";
      case "past_due":
        return "bg-yellow-100 text-yellow-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      case "unpaid":
        return "bg-red-100 text-red-800";
      case "incomplete":
        return "bg-orange-100 text-orange-800";
      case "incomplete_expired":
        return "bg-red-100 text-red-800";
      case "not_found":
      case "none":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return "✅";
      case "trialing":
        return "🆓";
      case "past_due":
        return "⚠️";
      case "canceled":
        return "❌";
      case "unpaid":
        return "💳";
      case "incomplete":
        return "⏳";
      case "incomplete_expired":
        return "⏰";
      case "not_found":
      case "none":
        return "🔒";
      default:
        return "❓";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center space-x-2">
        <span className="text-sm">{getStatusIcon(subscription.status)}</span>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
            subscription.status
          )}`}
        >
          {subscription.status.charAt(0).toUpperCase() +
            subscription.status.slice(1)}
        </span>
        {subscription.type && (
          <span className="text-xs text-gray-500">{subscription.type}</span>
        )}
      </div>

      {showDetails && (
        <div className="text-sm text-gray-600 space-y-1">
          <p>{statusMessage}</p>

          {subscription.current_period_start &&
            subscription.current_period_end && (
              <div className="text-xs text-gray-500">
                <p>
                  Current period:{" "}
                  {new Date(
                    subscription.current_period_start * 1000
                  ).toLocaleDateString()}{" "}
                  -{" "}
                  {new Date(
                    subscription.current_period_end * 1000
                  ).toLocaleDateString()}
                </p>
              </div>
            )}

          {!isActive && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-xs text-yellow-800">
                ⚠️ Your subscription needs attention. Please check your payment
                method or contact support.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubscriptionStatus;
