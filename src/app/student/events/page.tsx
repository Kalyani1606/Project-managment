"use client";
import React from "react";
import { AppProvider } from "@/context/AppContext";
import StudentPortal from "@/components/portals/StudentPortal";

export default function StudentEventsPage() {
  return (
    <AppProvider>
      <StudentPortal defaultTab="semester" />
    </AppProvider>
  );
}
