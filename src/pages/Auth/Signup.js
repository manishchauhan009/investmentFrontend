import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Colors from "../../styles/ColorSchema";

const API = process.env.REACT_APP_BACKEND_URL?.endsWith("/")
  ? process.env.REACT_APP_BACKEND_URL
  : `${process.env.REACT_APP_BACKEND_URL}/`;

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0); // OTP countdown timer
  const navigate = useNavigate();

  // Step 1: Register user & send OTP
  const handleSignup = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}api/v1/users/register`, {
        name,
        email,
        password,
      });

      if (res.data.success) {
        setOtpSent(true);
        setTimer(300); // 5 minutes countdown
      } else {
        setError(res.data.message || "Signup failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}api/v1/users/verify-otp`, {
        email,
        otp,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.data));
        navigate("/");
      } else {
        setError(res.data.message || "Invalid OTP");
        setOtp(""); // clear OTP input on failure
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  // Countdown effect for OTP expiry
  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
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
      <div className="w-full max-w-md">
        <form
          className="rounded-2xl shadow-2xl border backdrop-blur-xl p-8 sm:p-9"
          style={{
            backgroundColor: Colors.card,
            borderColor: Colors.primary,
          }}
          onSubmit={otpSent ? handleVerifyOtp : handleSignup}
        >
          {/* Header */}
          <div className="mb-6 flex flex-col items-center">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center mb-3 shadow-lg"
              style={{ backgroundColor: Colors.primary }}
            >
              <span
                className="text-xl font-bold"
                style={{ color: Colors.secondary }}
              >
                P
              </span>
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold text-center"
              style={{ color: Colors.textPrimary }}
            >
              {otpSent ? "Verify OTP" : "Create account"}
            </h2>
            <p
              className="mt-1 text-sm text-center"
              style={{ color: Colors.textSecondary }}
            >
              {otpSent
                ? `We’ve sent a verification code to ${email}.`
                : "Sign up to start tracking your portfolio."}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div
              className="mb-4 px-3 py-2 rounded-lg text-sm flex items-center gap-2"
              style={{ backgroundColor: "#B91C1C22", color: Colors.error }}
            >
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Signup form */}
          {!otpSent ? (
            <>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label
                    className="text-sm font-medium"
                    style={{ color: Colors.textSecondary }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    placeholder="Create a strong password"
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
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-5 w-full py-2.5 rounded-lg font-semibold flex justify-center items-center gap-2 text-sm shadow-md hover:opacity-95 transition disabled:cursor-not-allowed disabled:opacity-70"
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
                    Sending OTP...
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>
            </>
          ) : (
            /* STEP 2: OTP Verification */
            <>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label
                    className="text-sm font-medium"
                    style={{ color: Colors.textSecondary }}
                  >
                    OTP Code
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="Enter the 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none border bg-transparent focus:ring-2 transition"
                    style={{
                      borderColor: "#374151",
                      color: Colors.textPrimary,
                    }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-5 w-full py-2.5 rounded-lg font-semibold flex justify-center items-center gap-2 text-sm shadow-md hover:opacity-95 transition disabled:cursor-not-allowed disabled:opacity-70"
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
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>

              <div className="mt-4 text-center">
                {timer > 0 ? (
                  <p
                    className="text-xs sm:text-sm"
                    style={{ color: Colors.textSecondary }}
                  >
                    Resend OTP in{" "}
                    <span style={{ color: Colors.textPrimary }}>
                      {formatTime(timer)}
                    </span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleSignup}
                    disabled={loading}
                    className="mt-2 w-full py-2.5 rounded-lg text-sm border transition hover:bg-white/5 disabled:opacity-60"
                    style={{
                      borderColor: "#374151",
                      color: Colors.textPrimary,
                    }}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </>
          )}

          {/* Small footer text */}
          <p
            className="mt-4 text-[11px] text-center"
            style={{ color: Colors.textSecondary }}
          >
            Already have an account?{" "}
            <span
              className="cursor-pointer font-medium"
              style={{ color: Colors.secondary }}
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
