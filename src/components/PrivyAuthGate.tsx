import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ Import navigate + location
import { useAccess } from "../context/AccessContext";
import LoadingScreen from "./LoadingScreen";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  // "https://remo-server.onrender.com" || // Render production
  "http://localhost:8000"; // local

const STRIPE_BACKEND_URL =
  import.meta.env.VITE_STRIPE_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:3001" // local
    : "https://stripe-backend-4ian.onrender.com"); // Render production

// Helper function to check if subscription status allows access
const isSubscriptionActive = (status: string): boolean => {
  return status === "active" || status === "trialing";
};

const PrivyAuthGate: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { login, authenticated, ready, user } = usePrivy();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(false);
  const loginAttempted = useRef(false);
  const warmupSent = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setHasAccess, setSubscription } = useAccess();

  const userId = user?.id;
  const userEmail = user?.email?.address;

  useEffect(() => {
    if (ready && !authenticated) {
      loginAttempted.current = false;
      warmupSent.current = false;
    }
  }, [ready, authenticated]);

  useEffect(() => {
    if (ready && !authenticated && !loginAttempted.current) {
      loginAttempted.current = true;
      (async () => {
        try {
          await login();
        } catch (err) {
          if (err instanceof Error) {
            setLoginError(err.message);
          } else {
            setLoginError("Login failed");
          }
        }
      })();
    }
  }, [ready, authenticated, login]);

  // Reset warmupSent whenever userEmail changes (i.e., on user switch)
  useEffect(() => {
    warmupSent.current = false;
  }, [userEmail]);

  useEffect(() => {
    // Only check access after login, and only once per user
    if (authenticated && ready && !warmupSent.current && userEmail) {
      warmupSent.current = true;
      setCheckingAccess(true);
      fetch(`${STRIPE_BACKEND_URL}/api/user-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      })
        .then((res) => res.json())
        .then((data) => {
          setCheckingAccess(false);
          // Only set access state, never show error UI
          const hasValidAccess =
            data.hasAccess && isSubscriptionActive(data.status);
          setHasAccess(hasValidAccess);
          setSubscription(data); // Store the full subscription data
          // Do not redirect or show error here; let ProtectedRoute handle it
        })
        .catch(() => {
          setCheckingAccess(false);
          setHasAccess(false);
          setSubscription(null);
          // Do not show error UI; let ProtectedRoute handle it
        });
      // Optionally: warm up chat endpoint
      fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "__warmup__",
          conversation_history: [],
          user_id: userId,
        }),
      }).catch(() => {});
    }
  }, [
    authenticated,
    ready,
    userId,
    userEmail,
    navigate,
    location.pathname,
    setHasAccess,
    setSubscription,
  ]);

  // Show loading state with our custom loading screen
  if (!ready || checkingAccess) {
    return <LoadingScreen onLoadingComplete={() => {}} duration={1000} />;
  }

  // Show login error
  if (loginError) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Login Failed
          </h2>
          <p className="text-red-500 mb-6">{loginError}</p>
          <button
            onClick={() => {
              setLoginError(null);
              loginAttempted.current = false;
              login();
            }}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PrivyAuthGate;
