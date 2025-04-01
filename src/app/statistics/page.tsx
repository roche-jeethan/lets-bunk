import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function Statistics() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/auth/signin');
  }

  // Fetch all absences for the user
  const absences = await prisma.absence.findMany({
    where: { userId: user.id },
    orderBy: { date: 'desc' },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  // Calculate statistics
  const totalAbsences = absences.length;
  const subjectCounts = absences.reduce((acc: { [key: string]: number }, curr) => {
    acc[curr.subject] = (acc[curr.subject] || 0) + 1;
    return acc;
  }, {});

  const mostMissedSubject = Object.entries(subjectCounts)
    .sort(([,a], [,b]) => b - a)[0];

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
              <p className="text-3xl font-bold text-blue-600">{totalAbsences}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Most Missed Subject</p>
              <p className="text-3xl font-bold text-blue-600">{mostMissedSubject?.[0] || 'N/A'}</p>
              <p className="text-sm text-gray-500 mt-1">
                {mostMissedSubject ? `${mostMissedSubject[1]} times` : ''}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Last Absence</p>
              <p className="text-3xl font-bold text-blue-600">
                {absences[0] ? new Date(absences[0].date).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          {/* Detailed List */}
          <div className="px-6 py-4 border-t border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Absence History</h2>
            <div className="space-y-4">
              {absences.map((absence) => (
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