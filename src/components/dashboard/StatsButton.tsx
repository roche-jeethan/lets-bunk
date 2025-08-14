"use client";

import Link from "next/link";
import { ChartBarIcon } from "@heroicons/react/24/outline";

export default function StatsButton() {
  return (
    <Link
      href="/statistics"
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-all duration-200"
    >
      <ChartBarIcon className="h-5 w-5" />
      <span className="hidden sm:inline">Statistics</span>
    </Link>
  );
}
