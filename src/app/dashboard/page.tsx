import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import AbsenceList from "@/components/dashboard/AbsenceList";
import AddAbsenceForm from "@/components/dashboard/AddAbsenceForm";
import SignOutButton from "@/components/dashboard/SignOutButton";
import AbsenceSummary from "@/components/dashboard/AbsenceSummary";
import ProfileButton from "@/components/dashboard/ProfileButton";
import StatsButton from "@/components/dashboard/StatsButton";

export default async function Dashboard() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Attendance Dashboard</h1>
            <div className="flex items-center gap-4">
              <StatsButton />
              <ProfileButton />
              <SignOutButton />
            </div>
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
