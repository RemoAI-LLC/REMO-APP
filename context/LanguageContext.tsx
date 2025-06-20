import React, { createContext, useContext, useState } from "react";

// Define supported languages
export type Language = "en" | "es";

// Define context value shape
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

// Create the context with a default (safe dummy) value
const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
});

// Provider Component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom Hook
export const useLanguage = (): LanguageContextType => useContext(LanguageContext);
