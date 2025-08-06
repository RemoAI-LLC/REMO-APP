import React, { useState, useEffect } from "react";
import { HashRouter } from "react-router-dom";
import AppRoutes from "./routes";
import Layout from "./components/Layout";
import PrivyAuthGate from "./components/PrivyAuthGate";
import LoadingScreen from "./components/LoadingScreen";

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    // Check if there's a network delay by trying to load a resource
    const checkNetworkDelay = async () => {
      const startTime = Date.now();
      
      try {
        // Try to fetch a small resource to check network speed
        await fetch('/MainLogo.png', { 
          method: 'HEAD',
          cache: 'no-cache'
        });
        
        const loadTime = Date.now() - startTime;
        
        // If load time is more than 500ms, show loading screen
        if (loadTime > 500) {
          setShowLoading(true);
          // Show loading for at least 1 second
          setTimeout(() => {
            setShowLoading(false);
            setIsLoading(false);
          }, 1000);
        } else {
          // No significant delay, proceed immediately
          setIsLoading(false);
        }
      } catch (error) {
        // Network error, show loading screen
        setShowLoading(true);
        setTimeout(() => {
          setShowLoading(false);
          setIsLoading(false);
        }, 1000);
      }
    };

    checkNetworkDelay();
  }, []);

  const handleLoadingComplete = () => {
    setShowLoading(false);
    setIsLoading(false);
  };

  // Show our custom loading screen if there's a network delay
  if (isLoading && showLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} duration={1000} />;
  }

  // If no network delay, proceed with normal app flow
  return (
    <HashRouter>
      <PrivyAuthGate>
        <Layout>
          <AppRoutes />
        </Layout>
      </PrivyAuthGate>
    </HashRouter>
  );
};

export default App;
