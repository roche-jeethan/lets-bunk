"use client";

import { useState } from "react";
import Button from "../ui/Button";

interface DeleteAbsenceButtonProps {
  absenceId: string;
  onDelete: () => void;
}

export default function DeleteAbsenceButton({
  absenceId,
  onDelete,
}: DeleteAbsenceButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this absence?")) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/absences/${absenceId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to delete" }));
        throw new Error(errorData.error || "Failed to delete absence");
      }

      onDelete(); // Refresh the list
    } catch (err) {
      console.error("Error deleting absence:", err);
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col items-end">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-red-600 hover:text-red-800 hover:bg-red-50"
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
