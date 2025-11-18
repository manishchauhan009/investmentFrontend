import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Colors from "../../styles/ColorSchema";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}api/v1/users/login`,
        { email, password }
      );

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.data));
        navigate("/");
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: `
          radial-gradient(circle at top, ${Colors.secondary}22 0, transparent 55%),
          ${Colors.background}
        `,
      }}
    >
      {/* Subtle card shadow wrapper */}
      <div className="w-full max-w-md">
        <div
          className="rounded-2xl shadow-2xl border backdrop-blur-xl p-8 sm:p-9"
          style={{
            backgroundColor: Colors.card,
            borderColor: "#1F2937",
          }}
        >
          {/* Brand / Title */}
          <div className="mb-6 flex flex-col items-center">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center mb-3 shadow-lg"
              style={{ backgroundColor: Colors.primary }}
            >
              <span className="text-xl font-bold" style={{ color: Colors.secondary }}>
                P
              </span>
            </div>
            <h1
              className="text-2xl sm:text-3xl font-bold text-center"
              style={{ color: Colors.textPrimary }}
            >
              Welcome back
            </h1>
            <p
              className="mt-1 text-sm text-center"
              style={{ color: Colors.textSecondary }}
            >
              Sign in to continue to your portfolio dashboard.
            </p>
          </div>

          {error && (
            <div
              className="mb-4 px-3 py-2 rounded-lg text-sm flex items-center gap-2"
              style={{ backgroundColor: "#B91C1C22", color: Colors.error }}
            >
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label
                className="text-sm font-medium"
                style={{ color: Colors.textSecondary }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none border bg-transparent focus:ring-2 transition disabled:opacity-60"
                style={{
                  borderColor: "#374151",
                  color: Colors.textPrimary,
                }}
                required
              />
            </div>

            <div className="space-y-1">
              <label
                className="text-sm font-medium"
                style={{ color: Colors.textSecondary }}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none border bg-transparent focus:ring-2 transition disabled:opacity-60"
                style={{
                  borderColor: "#374151",
                  color: Colors.textPrimary,
                }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-2.5 rounded-lg font-semibold flex justify-center items-center gap-2 text-sm shadow-md hover:opacity-95 transition disabled:cursor-not-allowed disabled:opacity-70"
              style={{
                backgroundColor: Colors.secondary,
                color: Colors.textPrimary,
              }}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
</form>
            {/* Footer small text */}
            <p
              className="mt-4 text-[11px] text-center"
              style={{ color: Colors.textSecondary }}
            >
              Protected area. Use your registered credentials to access your
              portfolio.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
