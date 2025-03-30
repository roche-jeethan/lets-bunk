'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Absence = {
  id: string;
  date: string;
  subject: string;
  reason: string | null;
};

export default function AbsenceList() {
  const [absences, setAbsences] = useState<Absence[]>([]);

  useEffect(() => {
    fetchAbsences();
  }, []);

  const fetchAbsences = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const response = await fetch(`/api/absences?userId=${user.id}`);
    const data = await response.json();
    setAbsences(data);
  };

  return (
    <div className="space-y-4">
      {absences.length === 0 ? (
        <p className="text-gray-500">No absences recorded yet.</p>
      ) : (
        <div className="space-y-2">
          {absences.map((absence) => (
            <div key={absence.id} className="border p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{absence.subject}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(absence.date).toLocaleDateString()}
                  </p>
                </div>
                {absence.reason && (
                  <p className="text-sm text-gray-600">{absence.reason}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}