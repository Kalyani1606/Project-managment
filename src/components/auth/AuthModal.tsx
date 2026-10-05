"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { AnimatedAuthCard } from "./AnimatedAuthCard";
import { X } from "lucide-react";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalTab } = useAuth();

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen bg-[#FAF2EC] overflow-y-auto">
      <AnimatedAuthCard
        initialTab={authModalTab === "register" ? "register" : "login"}
        isModal={true}
        onCloseModal={closeAuthModal}
      />
    </div>
  );
}
