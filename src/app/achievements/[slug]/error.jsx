"use client";

import Link from "next/link";
import { Home, ArrowLeft, RefreshCcw } from "lucide-react";

export default function AchievementError({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">
          Error
        </p>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
          Failed to load achievement
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          {error?.message || "Something went wrong while loading this achievement."}
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-all"
          >
            <RefreshCcw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/achievements"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-white/40 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            All Achievements
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white transition-all shadow-lg shadow-blue-500/30"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
