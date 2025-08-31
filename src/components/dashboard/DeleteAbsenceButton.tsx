"use client";

import { useDeleteAbsence } from "@/hooks/useAbsences";

interface DeleteAbsenceButtonProps {
  absenceId: string;
}

export default function DeleteAbsenceButton({
  absenceId,
}: DeleteAbsenceButtonProps) {
  const {
    mutate: deleteAbsence,
    isPending,
    isError,
    error,
  } = useDeleteAbsence();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this absence?")) {
      return;
    }

    deleteAbsence(absenceId);
  };

  return (
    <div className="flex flex-col items-end">
      {isError && (
        <p className="text-red-500 dark:text-red-300 text-xs mb-1">
          {(error as Error).message}
        </p>
      )}
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 disabled:text-gray-400 dark:disabled:text-gray-600 transition-colors"
        title="Delete absence"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}
