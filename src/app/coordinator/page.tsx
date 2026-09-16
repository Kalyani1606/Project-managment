"use client";
import React from "react";
import { AppProvider } from "@/context/AppContext";
import CoordinatorPortal from "@/components/portals/CoordinatorPortal";

export default function Page() {
  return (
    <AppProvider>
      <CoordinatorPortal />
    </AppProvider>
  );
}
