"use client";

import { useAbsences } from "@/hooks/useAbsences";
import DeleteAbsenceButton from "./DeleteAbsenceButton";
import Loader from "../ui/Loader";

export default function AbsenceList() {
  const { data: absences, isLoading, error, refetch } = useAbsences();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-2 items-center justify-center p-8">
        <Loader />
        <div className="text-emerald-600">Loading absences...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 font-medium">Error loading absences</p>
        <p className="text-red-500 text-sm mt-1">{(error as Error).message}</p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {absences && absences.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-emerald-600">No absences recorded yet.</p>
          <p className="text-emerald-500 text-sm mt-1">
            Add your first absence using the form.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {absences &&
            absences
              .slice()
              .sort(
                (a: any, b: any) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((absence: any) => (
                <div
                  key={absence.id}
                  className="border border-emerald-200 p-4 rounded-lg hover:shadow-md hover:border-emerald-300 transition-all duration-200 bg-emerald-50"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-emerald-900">
                        {absence.subject}
                      </p>
                      <p className="text-sm text-emerald-700 mt-1">
                        {new Date(absence.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      {absence.reason && (
                        <p className="text-sm text-emerald-600 mt-2 italic">
                          Reason: {absence.reason}
                        </p>
                      )}
                    </div>
                    <DeleteAbsenceButton absenceId={absence.id} />
                  </div>
                </div>
              ))}
        </div>
      )}
    </div>
  );
}
