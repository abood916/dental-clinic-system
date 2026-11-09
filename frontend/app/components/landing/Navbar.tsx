"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full bg-[#0f172a] text-white py-4 px-6 sm:px-12 flex items-center justify-between border-b border-slate-800 shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-lg">
          🦷
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-wider uppercase text-white">
            Dental Clinic
          </h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">
            Advanced Management System
          </p>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-6 text-xs text-slate-300 font-medium">
        <a href="#features" className="hover:text-white transition-colors">
          Features
        </a>
        <a href="#pricing" className="hover:text-white transition-colors">
          Pricing
        </a>
        <a href="#demo" className="hover:text-white transition-colors">
          Demo
        </a>
      </nav>

      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 text-xs sm:text-sm font-medium text-white transition-colors shadow-sm"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}