"use client";

import { useAbsences } from "@/hooks/useAbsences";
import Loader from "../ui/Loader";

type SubjectCount = {
  subject: string;
  count: number;
};

export default function AbsenceSummary() {
  const { data: absences, isLoading, error, refetch } = useAbsences();
  const processData = () => {
    if (!absences) return { subjectCounts: [], totalAbsences: 0 };

    const counts = absences.reduce(
      (acc: Record<string, number>, absence: any) => {
        acc[absence.subject] = (acc[absence.subject] || 0) + 1;
        return acc;
      },
      {}
    );

    const sortedCounts = Object.entries(counts)
      .map(([subject, count]) => ({ subject, count: count as number }))
      .sort((a, b) => b.count - a.count);

    return {
      subjectCounts: sortedCounts,
      totalAbsences: absences.length,
    };
  };

  const { subjectCounts, totalAbsences } = processData();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-2 items-center justify-center p-8">
        <Loader />
        <div className="text-emerald-600 dark:text-emerald-400">
          Loading summary...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-600 dark:text-red-300 font-medium">
          Error loading summary
        </p>
        <p className="text-red-500 dark:text-red-400 text-sm mt-1">
          {(error as Error).message}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-3 py-1 bg-red-600 dark:bg-red-500 text-white text-sm rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-emerald-800 dark:text-emerald-200 mb-6">
        Absence Summary
      </h2>

      {totalAbsences === 0 ? (
        <div className="text-center py-12">
          <p className="text-emerald-600 dark:text-emerald-400 text-lg">
            No absences to summarize yet.
          </p>
          <p className="text-emerald-500 text-sm mt-2">
            Start adding absences to see your summary here.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-center">
            <div className="p-6 bg-emerald-100 dark:bg-slate-700 rounded-xl border border-emerald-200 dark:border-slate-600 w-full max-w-xs">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-700 dark:text-emerald-300">
                  {totalAbsences}
                </div>
                <div className="text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                  Total Absences
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-4">
              By Subject
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {subjectCounts.map(({ subject, count }) => (
                <div
                  key={subject}
                  className="bg-emerald-50 dark:bg-slate-700 border border-emerald-200 dark:border-slate-600 p-4 rounded-lg text-center hover:bg-emerald-100 dark:hover:bg-slate-600 transition-colors"
                >
                  <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                    {count}
                  </div>
                  <div className="text-sm text-emerald-600 dark:text-emerald-400 break-words mt-1">
                    {subject}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
