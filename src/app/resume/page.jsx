// src/app/resume/page.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResumePage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to internships page
    router.replace("/resume/internships");
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent mb-4"></div>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
}