"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatedAuthCard } from "@/components/auth/AnimatedAuthCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function LoginContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab = tabParam === "register" ? "register" : "login";

  return (
    <div className="w-screen h-screen min-h-screen bg-[#FCFCFA] relative overflow-hidden font-sans">
      {/* Floating Back to Home Button */}
      <Link
        href="/"
        className="absolute top-6 right-6 z-50 inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 transition px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 shadow-md"
      >
        <ArrowLeft className="w-4 h-4 text-[#FF5F38]" />
        <span>Back to Home</span>
      </Link>

      {/* The Animated Auth Card (Full Screen) */}
      <AnimatedAuthCard initialTab={initialTab} />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070B11] flex items-center justify-center text-slate-400 text-sm">Loading login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
