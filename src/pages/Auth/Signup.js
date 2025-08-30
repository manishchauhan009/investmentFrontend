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
      className="flex justify-center items-center h-screen"
      style={{ backgroundColor: Colors.background }}
    >
      <form
        className="bg-white p-8 rounded shadow-md w-96"
        onSubmit={otpSent ? handleVerifyOtp : handleSignup}
      >
        <h2
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: Colors.primary }}
        >
          {otpSent ? "Verify OTP" : "Sign Up"}
        </h2>

        {error && (
          <p className="mb-4 text-center text-red-500 font-medium">{error}</p>
        )}

        {!otpSent ? (
          <>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 mb-4 border rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 border rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 border rounded"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 rounded hover:opacity-90 transition"
              style={{
                backgroundColor: Colors.secondary,
                color: Colors.background,
              }}
            >
              {loading ? "Sending OTP..." : "Sign Up"}
            </button>
          </>
        ) : (
          <>
            <input
              type="number"
              inputMode="numeric"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 mb-4 border rounded"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 rounded hover:opacity-90 transition"
              style={{
                backgroundColor: Colors.secondary,
                color: Colors.background,
              }}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="mt-3 text-center">
              {timer > 0 ? (
                <p className="text-gray-600 text-sm">
                  Resend OTP in {formatTime(timer)}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleSignup}
                  className="mt-2 w-full p-3 rounded border hover:bg-gray-100"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default Signup;
