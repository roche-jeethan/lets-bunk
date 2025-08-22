"use client";

import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useAddAbsence } from "@/hooks/useAbsences";

export default function AddAbsenceForm() {
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const {
    mutate: addAbsence,
    isPending,
    isError,
    error,
    isSuccess,
  } = useAddAbsence();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    addAbsence(
      {
        subject,
        date,
        reason: reason || null,
      },
      {
        onSuccess: () => {
          setSubject("");
          setDate("");
          setReason("");
        },
      }
    );
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
          disabled={isPending}
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
          disabled={isPending}
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
          disabled={isPending}
          placeholder="e.g. Doctor appointment"
          className="w-full px-4 py-3 border-2 border-emerald-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
        />
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm font-medium">
            {(error as Error).message}
          </p>
        </div>
      )}

      {isSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <p className="text-emerald-600 text-sm font-medium">
            Absence added successfully!
          </p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
      >
        {isPending ? "Adding..." : "Add Absence"}
      </Button>
    </form>
  );
}
