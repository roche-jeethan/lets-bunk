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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-semibold mb-2 text-emerald-800"
        >
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
          className="w-full px-4 py-3 border-2 border-emerald-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
        />
      </div>

      <div>
        <label
          htmlFor="date"
          className="block text-sm font-semibold mb-2 text-emerald-800"
        >
          Date
        </label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          disabled={loading}
          max={new Date().toISOString().split("T")[0]}
          className="w-full px-4 py-3 border-2 border-emerald-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
        />
      </div>

      <div>
        <label
          htmlFor="reason"
          className="block text-sm font-semibold mb-2 text-emerald-800"
        >
          Reason (optional)
        </label>
        <Input
          id="reason"
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={loading}
          placeholder="e.g. Doctor appointment"
          className="w-full px-4 py-3 border-2 border-emerald-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <p className="text-emerald-600 text-sm font-medium">
            Absence added successfully!
          </p>
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
      >
        {loading ? "Adding..." : "Add Absence"}
      </Button>
    </form>
  );
}
