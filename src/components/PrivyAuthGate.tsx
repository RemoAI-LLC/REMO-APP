import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ Import navigate + location
import { useAccess } from "../context/AccessContext";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const STRIPE_BACKEND_URL = import.meta.env.VITE_STRIPE_API_URL;

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
  const { setHasAccess, setSubscription, isSubscriptionActive } = useAccess();

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
      console.log("🔍 Checking subscription for email:", userEmail);
      console.log("🔍 Using Stripe backend URL:", STRIPE_BACKEND_URL);

      fetch(`${STRIPE_BACKEND_URL}/api/user-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      })
        .then((res) => {
          console.log("🔍 API response status:", res.status);
          return res.json();
        })
        .then((data) => {
          console.log("🔍 API response data:", data);
          setCheckingAccess(false);
          // Only set access state, never show error UI
          const hasValidAccess =
            data.hasAccess && isSubscriptionActive(data.status);
          console.log(
            "🔍 hasValidAccess:",
            hasValidAccess,
            "data.hasAccess:",
            data.hasAccess,
            "data.status:",
            data.status
          );
          console.log("🔍 Setting hasAccess to:", hasValidAccess);
          console.log("🔍 Setting subscription to:", data);
          console.log(
            "🔍 isSubscriptionActive function result:",
            isSubscriptionActive(data.status)
          );
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

  // Show loading state
  if (!ready || checkingAccess) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            {checkingAccess ? "Verifying your subscription..." : "Loading..."}
          </p>
        </div>
      </div>
    );
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
