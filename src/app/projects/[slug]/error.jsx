"use client";

import Link from "next/link";
import { Home, ArrowLeft, RefreshCcw } from "lucide-react";

export default function ProjectError({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
          Error
        </p>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
          Failed to load project
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          {error?.message || "Something went wrong while loading this project."}
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 transition-all"
          >
            <RefreshCcw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-white/40 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            All Projects
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white transition-all shadow-lg shadow-purple-500/30"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
