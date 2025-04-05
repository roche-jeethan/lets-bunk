'use client';

import { useEffect, useState } from 'react';
import DeleteAbsenceButton from './DeleteAbsenceButton';

type Absence = {
  id: string;
  date: string;
  subject: string;
  reason: string | null;
  userId: string;
};

export default function AbsenceList() {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    fetchAbsences();
  }, []);

  const fetchAbsences = async () => {
    try {
      setIsLoading(true);
      
      // First try to load debug info
      const debugResponse = await fetch('/api/absences/debug', {
        credentials: 'include',
      });
      
      if (debugResponse.ok) {
        const debugData = await debugResponse.json();
        setDebugInfo(debugData);
        console.log('Debug data:', debugData);
        
        // If we have absences in debug data, use them
        if (debugData.absences && debugData.absences.length > 0) {
          setAbsences(debugData.absences);
          setIsLoading(false);
          return;
        }
      }
      
      // Now get the regular absences
      const response = await fetch('/api/absences', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch absences');
      }
      
      const data = await response.json();
      console.log('Fetched absences:', data);
      setAbsences(data);
    } catch (err) {
      console.error('Error fetching absences:', err);
      
      // Fall back to debug data if we have it and the normal fetch failed
      if (debugInfo?.absences && debugInfo.absences.length > 0) {
        setAbsences(debugInfo.absences);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load absences');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    fetchAbsences(); // Refresh the list after deletion
  };

  if (isLoading) return <div>Loading absences...</div>;
  
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        {debugInfo && (
          <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
            <p>Debug Info:</p>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {absences.length === 0 ? (
        <div>
          <p className="text-gray-500">No absences recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {absences
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((absence) => (
            <div key={absence.id} className="border p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{absence.subject}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(absence.date).toLocaleDateString()}
                  </p>
                  {absence.reason && (
                    <p className="text-sm text-gray-600 mt-1">{absence.reason}</p>
                  )}
                </div>
                <DeleteAbsenceButton 
                  absenceId={absence.id} 
                  onDelete={handleDelete}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}