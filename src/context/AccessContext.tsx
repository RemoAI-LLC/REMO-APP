import React, { createContext, useContext, useState } from "react";

interface StripeSubscription {
  hasAccess: boolean;
  type: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
}

interface AccessContextType {
  hasAccess: boolean;
  subscription: StripeSubscription | null;
  setHasAccess: (v: boolean) => void;
  setSubscription: (subscription: StripeSubscription | null) => void;
}

const AccessContext = createContext<AccessContextType>({
  hasAccess: false,
  subscription: null,
  setHasAccess: () => {},
  setSubscription: () => {},
});

export const AccessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [subscription, setSubscription] = useState<StripeSubscription | null>(null);
  
  return (
    <AccessContext.Provider value={{ hasAccess, subscription, setHasAccess, setSubscription }}>
      {children}
    </AccessContext.Provider>
  );
};

export const useAccess = () => useContext(AccessContext); 