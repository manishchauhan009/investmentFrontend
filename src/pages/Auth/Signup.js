import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Colors from "../../styles/ColorSchema";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate signup
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center h-screen" style={{ backgroundColor: Colors.background }}>
      <form className="bg-white p-8 rounded shadow-md w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: Colors.primary }}>Sign Up</h2>
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
          className="w-full p-3 rounded hover:opacity-90 transition"
          style={{ backgroundColor: Colors.secondary, color: Colors.background }}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
