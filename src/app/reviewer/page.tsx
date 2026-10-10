"use client";
import React, { Suspense } from "react";
import ReviewerPortalContent from "@/components/portals/ReviewerPortal";

export default function ReviewerPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    }>
      <ReviewerPortalContent />
    </Suspense>
  );
}
