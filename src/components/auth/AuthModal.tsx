"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { AnimatedAuthCard } from "./AnimatedAuthCard";
import { X } from "lucide-react";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalTab } = useAuth();

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen bg-[#FCFCFA] overflow-hidden">
      {/* Floating Close Button */}
      <button
        onClick={closeAuthModal}
        className="absolute top-6 right-6 z-50 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full border border-slate-200 shadow-md cursor-pointer"
      >
        <X className="w-4 h-4" />
        <span>Close</span>
      </button>

      <AnimatedAuthCard
        initialTab={authModalTab === "register" ? "register" : "login"}
        isModal={true}
        onCloseModal={closeAuthModal}
      />
    </div>
  );
}
