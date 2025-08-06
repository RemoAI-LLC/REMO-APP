import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  duration?: number; // Duration in milliseconds
  isVisible?: boolean; // Control visibility externally
  message?: string; // Custom loading message
  size?: 'small' | 'medium' | 'large'; // Size variants
  variant?: 'fullscreen' | 'inline' | 'overlay'; // Display variants
  showLogo?: boolean; // Whether to show the logo
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  onLoadingComplete, 
  duration = 2000,
  isVisible: externalIsVisible,
  message = "Loading...",
  size = 'medium',
  variant = 'fullscreen',
  showLogo = true
}) => {
  const [internalIsVisible, setInternalIsVisible] = useState(true);
  
  // Use external control if provided, otherwise use internal state
  const isVisible = externalIsVisible !== undefined ? externalIsVisible : internalIsVisible;

  useEffect(() => {
    if (externalIsVisible !== undefined) return; // Don't auto-hide if externally controlled
    
    const timer = setTimeout(() => {
      setInternalIsVisible(false);
      setTimeout(() => {
        onLoadingComplete?.();
      }, 500);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onLoadingComplete, externalIsVisible]);

  if (!isVisible) {
    return null;
  }

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-32 h-32',
    large: 'w-48 h-48'
  };

  const variantClasses = {
    fullscreen: 'fixed inset-0 bg-white dark:bg-black flex items-center justify-center z-50 transition-opacity duration-500',
    inline: 'flex items-center justify-center transition-opacity duration-500',
    overlay: 'absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center z-40 transition-opacity duration-500'
  };

  return (
    <div className={variantClasses[variant]}>
      <div className="relative flex flex-col items-center space-y-4">
        {showLogo && (
          <>
            {/* Rotating logo container */}
            <div className={`animate-spin-slow ${sizeClasses[size]}`}>
              <img 
                src="/MainLogo.png" 
                alt="REMO Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Pulse effect overlay */}
            <div className={`absolute inset-0 ${sizeClasses[size]} bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse`}></div>
          </>
        )}
        
        {/* Loading message */}
        {message && (
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen; 