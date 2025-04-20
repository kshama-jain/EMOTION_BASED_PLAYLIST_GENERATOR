import React, { useState } from "react";
import { useAuth } from "../lib/auth-context";
import { useNavigate } from "react-router-dom";
import { BackgroundGradientAnimation } from "../components/ui/background-gradient-animation";


export default function Signup() {
  const { signup } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await signup(username, email, password);
      setSuccess("Signup successful! Please login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Signup failed");
    }
  };

  return (
    <div className="relative min-h-screen w-full">
           <div className="absolute inset-0 z-0">
              <BackgroundGradientAnimation 
              gradientBackgroundStart="rgb(0, 40, 33)"
              gradientBackgroundEnd="rgb(0, 15, 4)"
              firstColor="0, 210, 200"
              secondColor="20, 180, 170"
              thirdColor="0, 150, 180"
              fourthColor="0, 120, 140"
              fifthColor="20, 220, 200"
              pointerColor="0, 200, 180"
                containerClassName="pointer-events-none"
              />
            </div>

    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white">
      <form onSubmit={handleSubmit} className="bg-opacity-98 p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
        {error && <div className="mb-4 text-red-400">{error}</div>}
        {success && <div className="mb-4 text-green-400">{success}</div>}
        <input
          className="w-full mb-4 p-2 rounded bg-[#1E1E1E] text-white"
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          className="w-full mb-4 p-2 rounded bg-[#1E1E1E] text-white"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="w-full mb-6 p-2 rounded bg-[#1E1E1E] text-white"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-[#1DB954] text-white py-2 rounded font-semibold hover:bg-opacity-80"
        >
          Sign Up
        </button>
      </form>
    </div>
    </div>
  );
}
