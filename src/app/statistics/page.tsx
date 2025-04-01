'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Statistics = {
  totalAbsences: number;
  mostMissedSubject: {
    subject: string;
    count: number;
  } | null;
  lastAbsence: any;
  absenceHistory: any[];
  subjectCounts: Record<string, number>;
};

export default function Statistics() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      console.log('Fetching statistics data...');
      const response = await fetch('/api/statistics');

      if (!response.ok) {
        console.error('Error response:', response.status, response.statusText);
        const errorData = await response.json().catch(() => ({}));
        console.error('Error data:', errorData);

        if (response.status === 401) {
          router.push('/auth/signin');
          return;
        }
        throw new Error(errorData.error || 'Failed to fetch statistics');
      }

      const data = await response.json();
      console.log('Received statistics data:', data);
      setStatistics(data);
    } catch (err) {
      console.error('Error in fetchStatistics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load statistics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <p className="text-gray-600">Loading statistics...</p>
      </div>
    );
  }

  if (error || !statistics) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load statistics'}</p>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Attendance Statistics</h1>
              <Link
                href="/dashboard"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Absences</p>
              <p className="text-3xl font-bold text-blue-600">{statistics.totalAbsences}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Most Missed Subject</p>
              <p className="text-3xl font-bold text-blue-600">
                {statistics.mostMissedSubject?.subject || 'N/A'}
              </p>
              {statistics.mostMissedSubject && (
                <p className="text-sm text-gray-500 mt-1">
                  {statistics.mostMissedSubject.count} times
                </p>
              )}
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Last Absence</p>
              <p className="text-3xl font-bold text-blue-600">
                {statistics.lastAbsence ? 
                  new Date(statistics.lastAbsence.date).toLocaleDateString() : 
                  'N/A'
                }
              </p>
            </div>
          </div>

          {/* Subject-wise Breakdown */}
          <div className="px-6 py-4 border-t border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Subject-wise Breakdown</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(statistics.subjectCounts).map(([subject, count]) => (
                <div key={subject} className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{subject}</p>
                  <p className="text-2xl font-bold text-blue-600">{count}</p>
                  <p className="text-sm text-gray-500">absences</p>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed History */}
          <div className="px-6 py-4 border-t border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Absence History</h2>
            <div className="space-y-4">
              {statistics.absenceHistory.map((absence) => (
                <div 
                  key={absence.id} 
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{absence.subject}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(absence.date).toLocaleDateString()}
                    </p>
                    {absence.reason && (
                      <p className="text-sm text-gray-600 mt-1">{absence.reason}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}