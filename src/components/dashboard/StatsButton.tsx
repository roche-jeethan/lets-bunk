'use client';

import Link from 'next/link';
import { ChartBarIcon } from '@heroicons/react/24/outline';

export default function StatsButton() {
  return (
    <Link
      href="/statistics"
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
    >
      <ChartBarIcon className="h-5 w-5" />
      <span>Statistics</span>
    </Link>
  );
}