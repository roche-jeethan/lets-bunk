"use client";

import { useEffect, useState } from "react";
import Loader from "../ui/Loader";

type SubjectCount = {
  subject: string;
  count: number;
};

type Absence = {
  id: string;
  subject: string;
  date: string;
  reason: string | null;
  userId: string;
};

export default function AbsenceSummary() {
  const [subjectCounts, setSubjectCounts] = useState<SubjectCount[]>([]);
  const [totalAbsences, setTotalAbsences] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAbsenceCounts();
    window.addEventListener("absenceCreated", fetchAbsenceCounts);
    return () =>
      window.removeEventListener("absenceCreated", fetchAbsenceCounts);
  }, []);

  const fetchAbsenceCounts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("Fetching absence summary...");

      const response = await fetch("/api/absences", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to parse error response" }));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Raw API response for summary:", data);

      const absencesData = data.absences || data || [];
      if (!Array.isArray(absencesData)) {
        console.error(
          "Expected array but got:",
          typeof absencesData,
          absencesData
        );
        throw new Error("Invalid data format: expected array of absences");
      }

      console.log("Processing absences for summary:", absencesData);
      const counts = absencesData.reduce(
        (acc: Record<string, number>, absence: Absence) => {
          acc[absence.subject] = (acc[absence.subject] || 0) + 1;
          return acc;
        },
        {}
      );
      const sortedCounts = Object.entries(counts)
        .map(([subject, count]) => ({ subject, count: count as number }))
        .sort((a, b) => b.count - a.count);

      setSubjectCounts(sortedCounts);
      setTotalAbsences(absencesData.length);
    } catch (err) {
      console.error("Error fetching absence summary:", err);
      setError(err instanceof Error ? err.message : "Failed to load summary");
      setSubjectCounts([]);
      setTotalAbsences(0);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-2 items-center justify-center p-8">
        <Loader/>
        <div className="text-emerald-600">Loading summary...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 font-medium">Error loading summary</p>
        <p className="text-red-500 text-sm mt-1">{error}</p>
        <button
          onClick={fetchAbsenceCounts}
          className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-emerald-800 mb-6">
        Absence Summary
      </h2>

      {totalAbsences === 0 ? (
        <div className="text-center py-12">
          <p className="text-emerald-600 text-lg">
            No absences to summarize yet.
          </p>
          <p className="text-emerald-500 text-sm mt-2">
            Start adding absences to see your summary here.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-center">
            <div className="p-6 bg-emerald-100 rounded-xl border border-emerald-200 w-full max-w-xs">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-700">
                  {totalAbsences}
                </div>
                <div className="text-emerald-600 font-medium mt-1">
                  Total Absences
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-emerald-800 mb-4">
              By Subject
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {subjectCounts.map(({ subject, count }) => (
                <div
                  key={subject}
                  className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg text-center hover:bg-emerald-100 transition-colors"
                >
                  <div className="text-2xl font-bold text-emerald-700">
                    {count}
                  </div>
                  <div className="text-sm text-emerald-600 break-words mt-1">
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
