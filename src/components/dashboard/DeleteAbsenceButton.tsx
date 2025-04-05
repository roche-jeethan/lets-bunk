'use client';

import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

type DeleteAbsenceButtonProps = {
  absenceId: string;
  onDelete: () => void;
};

export default function DeleteAbsenceButton({ absenceId, onDelete }: DeleteAbsenceButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/absences/${absenceId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete absence');
      }

      onDelete();
    } catch (error) {
      console.error('Error deleting absence:', error);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-600 text-sm font-medium hover:text-red-800 disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Confirm'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="text-gray-500 text-sm font-medium hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="text-gray-500 hover:text-red-600 transition-colors"
      title="Delete absence"
    >
      <TrashIcon className="h-5 w-5" />
    </button>
  );
}