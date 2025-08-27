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
        localStorage.setItem("token", res.data.token); // store token
        navigate("/"); // redirect to dashboard
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
      className="flex justify-center items-center h-screen"
      style={{ backgroundColor: Colors.background }}
    >
      <form
        className="bg-white p-8 rounded-2xl shadow-lg w-96 border border-gray-200"
        onSubmit={handleSubmit}
      >
        <h2
          className="text-3xl font-bold mb-6 text-center"
          style={{ color: Colors.primary }}
        >
          Login
        </h2>

        {error && (
          <p className="mb-4 text-center text-red-500 font-medium">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <button
          type="submit"
          className="w-full p-3 rounded-lg font-semibold hover:opacity-90 transition shadow"
          style={{ backgroundColor: Colors.secondary, color: Colors.background }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
