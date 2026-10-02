"use client";

import React, { Suspense } from "react";
import CoordinatorPortal from "@/components/portals/CoordinatorPortal";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-500 font-semibold">
          Loading Coordinator Portal...
        </div>
      }
    >
      <CoordinatorPortal />
    </Suspense>
  );
}
