"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      console.log("Fetching profile data...");
      const response = await fetch("/api/profile");

      if (!response.ok) {
        console.error("Error response:", response.status, response.statusText);
        const errorData = await response.json().catch(() => ({}));
        console.error("Error data:", errorData);

        if (response.status === 401) {
          router.push("/auth/signin");
          return;
        }
        throw new Error(errorData.error || "Failed to fetch profile");
      }

      const data = await response.json();
      console.log("Received profile data:", data);
      setProfile(data);
    } catch (err) {
      console.error("Error in fetchProfile:", err);
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-emerald-700 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-4 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl border border-emerald-200 shadow-lg p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="text-red-600 mb-4 font-medium">
            {error || "Failed to load profile"}
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <nav className="bg-white border-b border-emerald-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-emerald-900">Profile</h1>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-all duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-2xl border border-emerald-200 shadow-lg p-8">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mr-6">
                <svg
                  className="w-8 h-8 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-emerald-900">
                  Account Information
                </h2>
                <p className="text-emerald-600">Manage your personal details</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-emerald-800 mb-2">
                    Email Address
                  </h3>
                  <p className="text-lg text-emerald-900 font-medium">
                    {profile.email}
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-emerald-800 mb-2">
                    Full Name
                  </h3>
                  <p className="text-lg text-emerald-900 font-medium">
                    {profile.name || "Not set"}
                  </p>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-emerald-800 mb-2">
                  Account Created
                </h3>
                <p className="text-lg text-emerald-900 font-medium">
                  {new Date(profile.created_at).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-emerald-200 shadow-lg p-6">
              <h3 className="text-xl font-semibold text-emerald-800 mb-6">
                Quick Stats
              </h3>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-emerald-100 to-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-emerald-700 mb-1">
                    {profile.totalAbsences || 0}
                  </div>
                  <div className="text-emerald-600 font-medium">
                    Total Absences
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-100 to-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                  <div className="text-lg font-bold text-emerald-700 mb-1">
                    {profile.mostMissedSubject?.subject || "None"}
                  </div>
                  <div className="text-emerald-600 font-medium">
                    Most Missed Subject
                  </div>
                  {profile.mostMissedSubject && (
                    <div className="text-sm text-emerald-500 mt-1">
                      {profile.mostMissedSubject.count} absences
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-emerald-200 shadow-lg p-6">
              <h3 className="text-lg font-semibold text-emerald-800 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  href="/dashboard"
                  className="block w-full px-4 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors text-center"
                >
                  Add New Absence
                </Link>
                <Link
                  href="/statistics"
                  className="block w-full px-4 py-3 border-2 border-emerald-600 text-emerald-700 font-medium rounded-lg hover:bg-emerald-50 transition-colors text-center"
                >
                  View Statistics
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
