'use client';

import { useState } from 'react';

export default function AddAbsenceForm() {
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Add validation for date format
      const formattedDate = new Date(date).toISOString();

      const response = await fetch('/api/absences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          subject,
          date: formattedDate, // Send formatted date
          reason: reason || null, // Ensure null if empty
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Log detailed error information
        console.error('Server response:', {
          status: response.status,
          statusText: response.statusText,
          data,
        });

        throw new Error(
          data.error || 
          data.details?.message || 
          'Failed to create absence'
        );
      }

      console.log('Success:', data);

      // Reset form
      setSubject('');
      setDate('');
      setReason('');

      // Emit an event instead of reloading
      const event = new CustomEvent('absenceCreated');
      window.dispatchEvent(event);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create absence';
      console.error('Error details:', err);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="subject" className="block text-sm font-medium">
          Subject
        </label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>
      
      <div>
        <label htmlFor="date" className="block text-sm font-medium">
          Date
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label htmlFor="reason" className="block text-sm font-medium">
          Reason (optional)
        </label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          rows={3}
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Adding...' : 'Add Absence'}
      </button>
    </form>
  );
}