"use client";

import { useEffect, useState } from "react";
import DeleteAbsenceButton from "./DeleteAbsenceButton";

type Absence = {
  id: string;
  date: string;
  subject: string;
  reason: string | null;
  userId: string;
};

export default function AbsenceList() {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAbsences();
  }, []);

  const fetchAbsences = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("Fetching absences...");

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
      console.log("Raw API response:", data);

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

      console.log("Processed absences data:", absencesData);
      setAbsences(absencesData);
    } catch (err) {
      console.error("Error fetching absences:", err);
      setError(err instanceof Error ? err.message : "Failed to load absences");
      // Set empty array as fallback
      setAbsences([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    fetchAbsences();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-gray-600">Loading absences...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600 font-medium">Error loading absences</p>
        <p className="text-red-500 text-sm mt-1">{error}</p>
        <button
          onClick={fetchAbsences}
          className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {absences.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No absences recorded yet.</p>
          <p className="text-gray-400 text-sm mt-1">
            Add your first absence using the form on the left.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {absences
            .slice() // Create a copy to avoid mutating the original array
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((absence) => (
              <div
                key={absence.id}
                className="border p-4 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {absence.subject}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(absence.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    {absence.reason && (
                      <p className="text-sm text-gray-600 mt-2 italic">
                        Reason: {absence.reason}
                      </p>
                    )}
                  </div>
                  <DeleteAbsenceButton
                    absenceId={absence.id}
                    onDelete={handleDelete}
                  />
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
