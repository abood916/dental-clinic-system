"use client";

import Link from "next/link";
import Image from "next/image";  

export default function HeroSection() {
  return (
    <section className="w-full px-4 sm:px-8 lg:px-16 py-12 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">
      
      {/* Left Content */}
      <div className="flex-1 text-center lg:text-left">
        <span className="inline-block bg-slate-200 text-slate-800 text-[11px] sm:text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
          Advanced Management System
        </span>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
          ELEVATE YOUR CLINIC <br className="hidden sm:inline" />
          <span>WITH A MODERN, INTEGRATED</span> <br />
          MANAGEMENT SYSTEM.
        </h1>

        <p className="text-sm sm:text-base text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
          Streamline operations, enhance patient care, and manage finances with ease using an ultra-clean interface.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto rounded-lg bg-[#0f172a] hover:bg-slate-800 px-8 py-3.5 text-sm font-medium text-white transition-colors shadow-md text-center"
          >
            Request a Demo
          </Link>
          
          <Link
            href="/register"
            className="w-full sm:w-auto rounded-lg bg-white hover:bg-slate-50 border border-slate-300 px-8 py-3.5 text-sm font-medium text-slate-800 transition-colors text-center shadow-sm"
          >
            Sign Up Free
          </Link>
        </div>
      </div>

      
      <div className="flex-1 w-full max-w-xl lg:max-w-none flex justify-center">
        <div className="relative w-full rounded-2xl shadow-xl border border-slate-200 overflow-hidden bg-white p-2">
          <Image
            src="/image.png"       
            alt="Dental Clinic Dashboard Preview"
            width={700}
            height={450}
            className="w-full h-auto rounded-xl object-cover"
            priority
          />
        </div>
      </div>

    </section>
  );
}