

"use client";

import { useState, useEffect } from "react";
import type { FormEvent } from "react";

type User = {
  id?: string;
  userId?: string;
  fullName?: string;
  email?: string;
  role: string;
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Check existing session when the page loads
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsCheckingSession(false);
        return;
      }

      try {
        const response = await fetch(
          "https://dental-clinic-system-2.onrender.com/api/auth/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          localStorage.removeItem("token");
          setUser(null);
        } else {
          setUser(data.user);
        }
      } catch (error) {
        setMessage("Could not verify your session");
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "https://dental-clinic-system-2.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      setUser(data.user);
      setMessage("Login successful!");
    } catch (error) {
      setMessage("Could not connect to the server");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setEmail("");
    setPassword("");
    setMessage("Logged out successfully!");
  };

  if (isCheckingSession) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Checking session...
      </main>
    );
  }

  return (
  <main className="min-h-screen flex items-center justify-center bg-slate-200 p-4 sm:p-6">
    <div className="w-full max-w-md rounded-xl bg-slate-100 p-5 sm:p-8 shadow-2xl">

      <h1 className="mb-6 text-2xl font-bold text-center text-gray-900">
        Dental Clinic Login
      </h1>

      {user ? (
        <div className="text-center">

          <p className="mb-2 text-gray-800 break-words">
            Welcome back, {user.fullName || "User"}!
          </p>

          <p className="mb-6 text-gray-600">
            Role: {user.role}
          </p>

          <a
            href="/dashboard"
            className="block w-full rounded bg-blue-900 hover:bg-blue-800 p-3 text-white mb-3"
          >
            Go to Dashboard
          </a>

          <button
            onClick={handleLogout}
            className="w-full rounded bg-red-600 p-3 text-white hover:bg-red-500 cursor-pointer"
          >
            Logout
          </button>

        </div>
      ) : (
        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded border border-slate-300 p-3 text-base sm:text-sm text-gray-900"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded border border-slate-300 p-3 text-base sm:text-sm text-gray-900"
          />

          <div className="text-left">
            <p className="text-sm text-gray-600 font-semibold">
              Do not have an account?
              <a href="/register"
              className="text-blue-900 hover:underline font-bold"> Create</a> 
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded bg-blue-900 hover:bg-blue-800 p-3 text-white"
          >
            Login
          </button>

        </form>
      )}

      {message && (
        <p className="mt-4 text-center text-gray-700 break-words">
          {message}
        </p>
      )}

    </div>
  </main>
);
}
