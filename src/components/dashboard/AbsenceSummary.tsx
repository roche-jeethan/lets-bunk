'use client';

import { useEffect, useState } from 'react';

type SubjectCount = {
  subject: string;
  count: number;
};

export default function AbsenceSummary() {
  const [subjectCounts, setSubjectCounts] = useState<SubjectCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAbsenceCounts();
    // Listen for new absences
    window.addEventListener('absenceCreated', fetchAbsenceCounts);
    return () => window.removeEventListener('absenceCreated', fetchAbsenceCounts);
  }, []);

  const fetchAbsenceCounts = async () => {
    try {
      const response = await fetch('/api/absences', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch absences');
      }
      
      const absences = await response.json();
      
      // Count absences by subject
    interface Absence {
      subject: string;
    }

    interface AbsenceCounts {
      [key: string]: number;
    }

    const counts = absences.reduce((acc: AbsenceCounts, curr: Absence) => {
      acc[curr.subject] = (acc[curr.subject] || 0) + 1;
      return acc;
    }, {} as AbsenceCounts);

      // Convert to array and sort by count
      const sortedCounts = Object.entries(counts)
        .map(([subject, count]) => ({ subject, count: count as number }))
        .sort((a, b) => b.count - a.count);

      setSubjectCounts(sortedCounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load summary');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading summary...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Absence Summary</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {subjectCounts.map(({ subject, count }) => (
          <div 
            key={subject}
            className="bg-gray-50 p-4 rounded-lg text-center"
          >
            <div className="text-2xl font-bold text-blue-600">{count}</div>
            <div className="text-sm text-gray-600">{subject}</div>
          </div>
        ))}
      </div>
    </div>
  );
}