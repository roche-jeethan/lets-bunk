"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";

type Statistics = {
  totalAbsences: number;
  mostMissedSubject: {
    subject: string;
    count: number;
  } | null;
  lastAbsence: any;
  absenceHistory: any[];
  subjectCounts: Record<string, number>;
};

export default function Statistics() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      console.log("Fetching statistics data...");
      const response = await fetch("/api/statistics");

      if (!response.ok) {
        console.error("Error response:", response.status, response.statusText);
        const errorData = await response.json().catch(() => ({}));
        console.error("Error data:", errorData);

        if (response.status === 401) {
          router.push("/auth/signin");
          return;
        }
        throw new Error(errorData.error || "Failed to fetch statistics");
      }

      const data = await response.json();
      console.log("Received statistics data:", data);
      setStatistics(data);
    } catch (err) {
      console.error("Error in fetchStatistics:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load statistics"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-slate-900 dark:to-slate-800 p-4 flex items-center justify-center">
        <div className="text-center">
          <Loader />
          <p className="text-emerald-700 dark:text-emerald-300 mt-4">
            Loading statistics...
          </p>
        </div>
      </div>
    );
  }

  if (error || !statistics) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-slate-900 dark:to-slate-800 p-4 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-slate-800 rounded-2xl border border-emerald-200 dark:border-slate-700 shadow-lg p-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="text-red-600 dark:text-red-300 mb-4 font-medium">
            {error || "Failed to load statistics"}
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 dark:bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-slate-900 dark:to-slate-800">
      <nav className="bg-white dark:bg-slate-900 border-b border-emerald-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                Statistics
              </h1>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
            Attendance Statistics
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-2xl border border-emerald-200 dark:border-slate-700 shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-slate-900 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-6 h-6 text-emerald-600 dark:text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
                Total Absences
              </h3>
            </div>
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                {statistics.totalAbsences}
              </div>
              <div className="text-emerald-700 dark:text-emerald-300 font-medium">
                Classes Missed
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-2xl border border-emerald-200 dark:border-slate-700 shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-slate-900 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-6 h-6 text-emerald-600 dark:text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
                Most Missed
              </h3>
            </div>
            <div className="text-center py-4">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                {statistics.mostMissedSubject?.subject || "N/A"}
              </div>
              <div className="text-emerald-700 dark:text-emerald-300 font-medium">
                {statistics.mostMissedSubject
                  ? `${statistics.mostMissedSubject.count} times`
                  : "No data"}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-2xl border border-emerald-200 dark:border-slate-700 shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-slate-900 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-6 h-6 text-emerald-600 dark:text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
                Last Absence
              </h3>
            </div>
            <div className="text-center py-4">
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                {statistics.lastAbsence
                  ? new Date(statistics.lastAbsence.date).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )
                  : "N/A"}
              </div>
              <div className="text-emerald-700 dark:text-emerald-300 font-medium">
                {statistics.lastAbsence?.subject || "No recent absences"}
              </div>
            </div>
          </div>
          <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-2xl border border-emerald-200 dark:border-slate-700 shadow-lg p-6">
            <h3 className="text-xl font-semibold text-emerald-800 dark:text-emerald-200 mb-6">
              Subject-wise Breakdown
            </h3>

            {Object.keys(statistics.subjectCounts).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-emerald-600 dark:text-emerald-400">
                  No subject data available
                </p>
                <p className="text-emerald-500 dark:text-emerald-500 text-sm mt-1">
                  Start adding absences to see breakdown
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(statistics.subjectCounts).map(
                  ([subject, count]) => (
                    <div
                      key={subject}
                      className="bg-emerald-50 dark:bg-slate-700 border border-emerald-200 dark:border-slate-600 p-4 rounded-xl text-center hover:bg-emerald-100 dark:hover:bg-slate-600 transition-colors"
                    >
                      <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mb-1">
                        {count}
                      </div>
                      <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium break-words">
                        {subject}
                      </div>
                      <div className="text-xs text-emerald-500 dark:text-emerald-500 mt-1">
                        absences
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
          <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-2xl border border-emerald-200 dark:border-slate-700 shadow-lg p-6">
            <h3 className="text-xl font-semibold text-emerald-800 dark:text-emerald-200 mb-6">
              Quick Insights
            </h3>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-100 to-emerald-50 dark:from-slate-700 dark:to-slate-600 border border-emerald-200 dark:border-slate-600 rounded-xl p-4">
                <div className="text-sm text-emerald-800 dark:text-emerald-200 font-medium mb-1">
                  Average per Subject
                </div>
                <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                  {Object.keys(statistics.subjectCounts).length > 0
                    ? (
                        statistics.totalAbsences /
                        Object.keys(statistics.subjectCounts).length
                      ).toFixed(1)
                    : "0"}
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-100 to-emerald-50 dark:from-slate-700 dark:to-slate-600 border border-emerald-200 dark:border-slate-600 rounded-xl p-4">
                <div className="text-sm text-emerald-800 dark:text-emerald-200 font-medium mb-1">
                  Subjects Tracked
                </div>
                <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                  {Object.keys(statistics.subjectCounts).length}
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-12 bg-white dark:bg-slate-800 rounded-2xl border border-emerald-200 dark:border-slate-700 shadow-lg p-6">
            <h3 className="text-xl font-semibold text-emerald-800 dark:text-emerald-200 mb-6">
              Recent Absence History
            </h3>

            {statistics.absenceHistory.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-emerald-600 dark:text-emerald-400">
                  No absence history available
                </p>
                <p className="text-emerald-500 dark:text-emerald-500 text-sm mt-1">
                  Your absence records will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-custom">
                {statistics.absenceHistory.map((absence) => (
                  <div
                    key={absence.id}
                    className="border border-emerald-200 dark:border-slate-600 p-4 rounded-lg hover:shadow-md hover:border-emerald-300 dark:hover:border-slate-500 transition-all duration-200 bg-emerald-50 dark:bg-slate-700"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="font-semibold text-emerald-900 dark:text-emerald-100">
                            {absence.subject}
                          </div>
                          <div className="text-sm text-emerald-600 dark:text-emerald-300 bg-emerald-100 dark:bg-slate-600 px-2 py-1 rounded-full">
                            {new Date(absence.date).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </div>
                        </div>
                        {absence.reason && (
                          <p className="text-sm text-emerald-600 dark:text-emerald-300 italic">
                            Reason: {absence.reason}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
