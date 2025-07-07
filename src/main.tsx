import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Import PrivyProvider from the SDK
import { PrivyProvider } from "@privy-io/react-auth";
import { AccessProvider } from "./context/AccessContext";
import { FontSizeProvider } from "./context/FontSizeContext";

// Get your Privy App ID from environment variables
const privyAppId = import.meta.env.VITE_PRIVY_APP_ID;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FontSizeProvider>
      <AccessProvider>
        <PrivyProvider
          appId={privyAppId}
          config={{
            loginMethods: ["google", "linkedin", "twitter", "email"],
          }}
        >
          <App />
        </PrivyProvider>
      </AccessProvider>
    </FontSizeProvider>
  </React.StrictMode>
);
