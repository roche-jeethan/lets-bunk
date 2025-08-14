"use client";

import { useEffect, useState } from "react";

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
    // Listen for new absences
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

      // Handle the API response structure - your API returns { absences: [...] }
      const absencesData = data.absences || data || [];

      // Ensure we have an array
      if (!Array.isArray(absencesData)) {
        console.error(
          "Expected array but got:",
          typeof absencesData,
          absencesData
        );
        throw new Error("Invalid data format: expected array of absences");
      }

      console.log("Processing absences for summary:", absencesData);

      // Count absences by subject
      const counts = absencesData.reduce(
        (acc: Record<string, number>, absence: Absence) => {
          acc[absence.subject] = (acc[absence.subject] || 0) + 1;
          return acc;
        },
        {}
      );

      // Convert to array and sort by count
      const sortedCounts = Object.entries(counts)
        .map(([subject, count]) => ({ subject, count: count as number }))
        .sort((a, b) => b.count - a.count);

      setSubjectCounts(sortedCounts);
      setTotalAbsences(absencesData.length);
    } catch (err) {
      console.error("Error fetching absence summary:", err);
      setError(err instanceof Error ? err.message : "Failed to load summary");
      // Set empty arrays as fallback
      setSubjectCounts([]);
      setTotalAbsences(0);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-center">
          <div className="text-gray-600">Loading summary...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 font-medium">Error loading summary</p>
          <p className="text-red-500 text-sm mt-1">{error}</p>
          <button
            onClick={fetchAbsenceCounts}
            className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Absence Summary</h2>

      {totalAbsences === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No absences to summarize yet.</p>
          <p className="text-gray-400 text-sm mt-1">
            Start adding absences to see your summary here.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {totalAbsences}
              </div>
              <div className="text-sm text-gray-600">Total Absences</div>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-3">By Subject</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {subjectCounts.map(({ subject, count }) => (
              <div
                key={subject}
                className="bg-gray-50 p-4 rounded-lg text-center hover:bg-gray-100 transition-colors"
              >
                <div className="text-2xl font-bold text-blue-600">{count}</div>
                <div className="text-sm text-gray-600 break-words">
                  {subject}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
