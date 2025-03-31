import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AbsenceList from '@/components/dashboard/AbsenceList';
import AddAbsenceForm from '@/components/dashboard/AddAbsenceForm';
import SignOutButton from '@/components/dashboard/SignOutButton';
import AbsenceSummary from '@/components/dashboard/AbsenceSummary';

export default async function Dashboard() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Attendance Dashboard</h1>
            <SignOutButton />
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Add New Absence</h2>
              <AddAbsenceForm />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Absences</h2>
              <AbsenceList />
            </div>
          </div>
        </div>
        
        <AbsenceSummary />
      </div>
    </div>
  );
}