import React, { createContext, useContext, useState } from "react";

interface AccessContextType {
  hasAccess: boolean;
  setHasAccess: (v: boolean) => void;
}

const AccessContext = createContext<AccessContextType>({
  hasAccess: false,
  setHasAccess: () => {},
});

export const AccessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasAccess, setHasAccess] = useState(false);
  return (
    <AccessContext.Provider value={{ hasAccess, setHasAccess }}>
      {children}
    </AccessContext.Provider>
  );
};

export const useAccess = () => useContext(AccessContext); 