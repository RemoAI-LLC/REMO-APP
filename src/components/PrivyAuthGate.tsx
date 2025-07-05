import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ Import navigate + location
import { useAccess } from "../context/AccessContext";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://remo-server.onrender.com" || // Render production
  "http://localhost:8000"; // local

const STRIPE_BACKEND_URL =
  import.meta.env.VITE_STRIPE_BACKEND_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:3001" // local
    : "https://stripe-backend-4ian.onrender.com"); // Render production

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
      console.log("Checking access for", userEmail); // DEBUG
      fetch(`${STRIPE_BACKEND_URL}/api/user-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      })
        .then((res) => res.json())
        .then((data) => {
          setCheckingAccess(false);
          setHasAccess(!!data.hasAccess);
          setSubscription(data); // Store the full subscription data
          if (data.hasAccess) {
            navigate("/home", { replace: true });
          } else {
            navigate("/pricing", { replace: true });
          }
        })
        .catch(() => {
          setCheckingAccess(false);
          setHasAccess(false);
          setSubscription(null);
          // fallback: show pricing
          navigate("/pricing", { replace: true });
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
  }, [authenticated, ready, userId, userEmail, navigate, location.pathname, setHasAccess, setSubscription]);

  if (!ready || checkingAccess)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (loginError) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Login failed: {loginError}</p>
          <button
            onClick={() => {
              setLoginError(null);
              loginAttempted.current = false;
              login();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
