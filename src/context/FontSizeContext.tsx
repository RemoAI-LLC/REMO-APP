import React, { createContext, useContext, useState, useEffect } from "react";

type FontSize = 'small' | 'medium' | 'large';

interface FontSizeContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const FontSizeContext = createContext<FontSizeContextType>({
  fontSize: 'medium',
  setFontSize: () => {},
});

// Helper function to apply font size to document
const applyFontSize = (size: FontSize) => {
  // Remove existing font size classes
  document.documentElement.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
  // Add new font size class
  document.documentElement.classList.add(`font-size-${size}`);
  // Store in localStorage
  localStorage.setItem('fontSize', size);
};

export const FontSizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    // Initialize from localStorage or default to medium
    const saved = localStorage.getItem('fontSize') as FontSize;
    return saved && ['small', 'medium', 'large'].includes(saved) ? saved : 'medium';
  });
  
  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    applyFontSize(size);
  };

  // Apply font size on mount
  useEffect(() => {
    applyFontSize(fontSize);
  }, []);
  
  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => useContext(FontSizeContext); 