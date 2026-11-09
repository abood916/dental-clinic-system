"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "https://dental-clinic-system-2.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            email,
            password,
            role: "receptionist", 
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Registration failed");
        return;
      }

      setMessage("Account created successfully! You can login now.");
    } catch (error) {
      setMessage("Could not connect to the server");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-200 p-4">
      <div className="w-full max-w-md rounded-xl bg-slate-100 p-6 shadow-xl">
        
        <h1 className="mb-6 text-2xl font-bold text-center text-gray-900">
          Create Account
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">
          
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full rounded border border-slate-300 p-3 text-sm text-gray-900 bg-white"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded border border-slate-300 p-3 text-sm text-gray-900 bg-white"
          />

          <input
            type="password"
            placeholder="Password (min 8 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full rounded border border-slate-300 p-3 text-sm text-gray-900 bg-white"
          />

          <div className="text-left">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-900 font-bold hover:underline">
                Login
              </Link>
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded bg-blue-900 hover:bg-blue-800 p-3 text-white cursor-pointer"
          >
            Register
          </button>

        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">
            {message}
          </p>
        )}

      </div>
    </main>
  );
}