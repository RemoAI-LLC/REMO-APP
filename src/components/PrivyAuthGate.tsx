import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ Import navigate + location

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://remo-server.onrender.com" ||
  "http://localhost:8000";

const PrivyAuthGate: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { login, authenticated, ready, user } = usePrivy();
  const [loginError, setLoginError] = useState<string | null>(null);
  const loginAttempted = useRef(false);
  const warmupSent = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userId = user?.id;

  useEffect(() => {
    if (ready && !authenticated) {
      loginAttempted.current = false;
      warmupSent.current = false;
    }
  }, [ready, authenticated]);

  useEffect(() => {
    if (ready && !authenticated && !loginAttempted.current) {
      loginAttempted.current = true;
      login().catch((err: unknown) => {
        if (err instanceof Error) {
          setLoginError(err.message);
        } else {
          setLoginError("Login failed");
        }
      });
    }
  }, [ready, authenticated, login]);

  useEffect(() => {
    if (authenticated && ready && !warmupSent.current) {
      warmupSent.current = true;

      fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "__warmup__",
          conversation_history: [],
          user_id: userId,
        }),
      }).catch(() => {});

      // ✅ Redirect to /pricing only if not already there
      if (location.pathname === "/" || location.pathname === "/login") {
        navigate("/pricing", { replace: true });
      }
    }
  }, [authenticated, ready, userId, navigate, location.pathname]);

  if (!ready)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (loginError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <p className="text-red-600">{loginError}</p>
        <button
          onClick={() => {
            setLoginError(null);
            loginAttempted.current = false;
          }}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 ml-4"
        >
          Retry Login
        </button>
      </div>
    );
  }

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <p>Logging in...</p>
    </div>
  );
};

export default PrivyAuthGate;
