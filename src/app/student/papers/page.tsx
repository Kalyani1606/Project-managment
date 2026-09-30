"use client";
import React from "react";
import { AppProvider } from "@/context/AppContext";
import StudentPortal from "@/components/portals/StudentPortal";

export default function Page() {
  return (
    <AppProvider>
      <StudentPortal defaultTab="semester" activeSection="papers" />
    </AppProvider>
  );
}
