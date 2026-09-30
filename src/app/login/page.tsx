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
    <div className="w-screen h-screen min-h-screen bg-[#FAF2EC] relative overflow-hidden font-sans">
      {/* Floating Back to Home Button */}
      <Link
        href="/"
        className="absolute top-6 right-6 z-50 inline-flex items-center gap-2 text-xs font-bold text-[#111827] hover:text-black transition px-4 py-2 rounded-full bg-white hover:bg-[#FAF2EC] border border-[#EADBD0] shadow-md"
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
    <Suspense fallback={<div className="min-h-screen bg-[#FAF2EC] flex items-center justify-center text-[#111827] text-sm font-semibold">Loading login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
