"use client";
import React from "react";
import { AppProvider } from "@/context/AppContext";
import StudentPortal from "@/components/portals/StudentPortal";

export default function StudentReviewsPage() {
  return (
    <AppProvider>
      <StudentPortal defaultTab="reviews" />
    </AppProvider>
  );
}
