import React, { createContext, useContext, useState } from "react";

interface StripeSubscription {
  hasAccess: boolean;
  status: string;
  current_period_start: number | null;
  current_period_end: number | null;
}

interface AccessContextType {
  hasAccess: boolean;
  subscription: StripeSubscription | null;
  setHasAccess: (v: boolean) => void;
  setSubscription: (subscription: StripeSubscription | null) => void;
  isSubscriptionActive: (status: string) => boolean;
  getSubscriptionStatusMessage: (status: string, type: string | null) => string;
  refreshAccess: () => void;
}

const AccessContext = createContext<AccessContextType>({
  hasAccess: false,
  subscription: null,
  setHasAccess: () => {},
  setSubscription: () => {},
  isSubscriptionActive: () => false,
  getSubscriptionStatusMessage: () => "",
  refreshAccess: () => {},
});

// Helper function to check if subscription status allows access
const isSubscriptionActive = (status: string): boolean => {
  return status === "active" || status === "trialing";
};

// Helper function to get subscription status message
const getSubscriptionStatusMessage = (
  status: string,
  type: string | null
): string => {
  switch (status) {
    case "active":
      return "Your subscription is active!";
    case "trialing":
      return "You're currently on a trial period.";
    case "past_due":
      return "Your subscription payment is past due. Please update your payment method.";
    case "canceled":
      return "Your subscription has been cancelled.";
    case "unpaid":
      return "Your subscription payment failed. Please update your payment method.";
    case "incomplete":
      return "Your subscription setup is incomplete.";
    case "incomplete_expired":
      return "Your subscription setup has expired.";
    case "not_found":
      return "No subscription found. Please subscribe to access the app.";
    case "none":
      return "No active subscription found. Please subscribe to access the app.";
    default:
      return "Subscription status unknown. Please contact support.";
  }
};

export const AccessProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [subscription, setSubscription] = useState<StripeSubscription | null>(
    null
  );

  const refreshAccess = () => {
    // This function can be used to manually refresh access status
    // It will be implemented by components that need to refresh access
    console.log("Access refresh requested");
  };

  return (
    <AccessContext.Provider
      value={{
        hasAccess,
        subscription,
        setHasAccess,
        setSubscription,
        isSubscriptionActive,
        getSubscriptionStatusMessage,
        refreshAccess,
      }}
    >
      {children}
    </AccessContext.Provider>
  );
};

export const useAccess = () => useContext(AccessContext);
