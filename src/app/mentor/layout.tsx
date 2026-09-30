"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF2EC] flex flex-col items-center justify-center text-[#111827]">
        <div className="w-10 h-10 border-3 border-[#0B2E26]/30 border-t-[#0B2E26] rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-600">Loading Mentor Portal...</p>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
