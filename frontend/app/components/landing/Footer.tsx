"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0f172a] text-slate-400 py-8 px-4 sm:px-8 lg:px-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        
        {/* Brand & Copyright */}
        <div>
          <p className="text-xs font-medium text-slate-300">
            Dental Clinic Management System
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            &copy; 2026 All rights reserved.
          </p>
        </div>

        {/* Contact Info & Links */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs">
          <span className="text-slate-400">
            Contact us: <a href="mailto:ahmad@example.com" className="text-slate-200 hover:underline">aboodalshafie38@gmail.com</a>
          </span>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}