"use client";

import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function AddAbsenceForm() {
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/absences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          subject,
          date,
          reason: reason || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create absence");
        return;
      }

      setSuccess(true);
      setSubject("");
      setDate("");
      setReason("");

      // Trigger a custom event to refresh other components
      window.dispatchEvent(new Event("absenceCreated"));

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error creating absence:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="subject" className="block text-sm font-medium mb-1">
          Subject
        </label>
        <Input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          disabled={loading}
          placeholder="e.g. Mathematics"
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium mb-1">
          Date
        </label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          disabled={loading}
          max={new Date().toISOString().split("T")[0]} // Prevent future dates
        />
      </div>

      <div>
        <label htmlFor="reason" className="block text-sm font-medium mb-1">
          Reason (optional)
        </label>
        <Input
          id="reason"
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={loading}
          placeholder="e.g. Doctor appointment"
        />
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && (
        <div className="text-green-600 text-sm">
          Absence added successfully!
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Adding..." : "Add Absence"}
      </Button>
    </form>
  );
}
