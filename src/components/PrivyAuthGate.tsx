import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useRef, useState } from "react";

const PrivyAuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { login, authenticated, ready } = usePrivy();
  const [loginError, setLoginError] = useState<string | null>(null);
  const loginAttempted = useRef(false);

  useEffect(() => {
    // Reset loginAttempted when user is logged out, so login is retried
    if (ready && !authenticated) {
      loginAttempted.current = false;
    }
  }, [ready, authenticated]);

  useEffect(() => {
    if (ready && !authenticated && !loginAttempted.current) {
      loginAttempted.current = true;
      Promise.resolve(login()).catch((err: unknown) => {
        if (err instanceof Error) {
          setLoginError(err.message);
        } else {
          setLoginError("Login failed");
        }
      });
    }
  }, [ready, authenticated, login]);

  if (!ready) return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>;

  if (loginError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <p className="text-red-600">{loginError}</p>
        <button
          onClick={() => {
            setLoginError(null);
            loginAttempted.current = false; // Allow retry
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