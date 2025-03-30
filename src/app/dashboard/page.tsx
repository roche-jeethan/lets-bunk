import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AbsenceList from '@/components/dashboard/AbsenceList';
import AddAbsenceForm from '@/components/dashboard/AddAbsenceForm';

export default async function Dashboard() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">Attendance Dashboard</h1>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Add New Absence</h2>
              <AddAbsenceForm userId={session.user.id} />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Absences</h2>
              <AbsenceList userId={session.user.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}