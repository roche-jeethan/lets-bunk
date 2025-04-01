'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type UserProfile = {
  email: string;
  name: string;
  created_at: string;
  totalAbsences?: number;
  mostMissedSubject?: {
    subject: string;
    count: number;
  };
};

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile data...');
      const response = await fetch('/api/profile');

      if (!response.ok) {
        console.error('Error response:', response.status, response.statusText);
        const errorData = await response.json().catch(() => ({}));
        console.error('Error data:', errorData);
        
        if (response.status === 401) {
          router.push('/auth/signin');
          return;
        }
        throw new Error(errorData.error || 'Failed to fetch profile');
      }

      const data = await response.json();
      console.log('Received profile data:', data);
      setProfile(data);
    } catch (err) {
      console.error('Error in fetchProfile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load profile'}</p>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              <Link
                href="/dashboard"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-lg">{profile.email}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p className="mt-1 text-lg">{profile.name || 'Not set'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Account Created</h3>
                <p className="mt-1 text-lg">
                  {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total Absences</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {profile.totalAbsences || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Most Missed Subject</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {profile.mostMissedSubject?.subject || '-'}
                  </p>
                  {profile.mostMissedSubject && (
                    <p className="text-sm text-gray-500 mt-1">
                      {profile.mostMissedSubject.count} times
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}