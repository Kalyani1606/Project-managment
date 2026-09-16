"use client";
import React from "react";
import { AppProvider } from "@/context/AppContext";
import ReviewerPortal from "@/components/portals/ReviewerPortal";

export default function Page() {
  return (
    <AppProvider>
      <ReviewerPortal />
    </AppProvider>
  );
}
