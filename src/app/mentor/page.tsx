"use client";
import React from "react";
import { AppProvider } from "@/context/AppContext";
import MentorPortal from "@/components/portals/MentorPortal";

export default function Page() {
  return (
    <AppProvider>
      <MentorPortal />
    </AppProvider>
  );
}
