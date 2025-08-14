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
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <nav className="bg-white border-b border-emerald-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-emerald-900">LetsBunk</h1>
            </div>
            <div className="flex items-center space-x-4">
              <StatsButton />
              <ProfileButton />
              <SignOutButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-emerald-900">Dashboard</h2>
          <p className="text-emerald-700 mt-2">
            Track and manage your attendance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-2xl border border-emerald-200 shadow-lg p-6">
            <h3 className="text-xl font-semibold text-emerald-800 mb-6">
              Add New Absence
            </h3>
            <AddAbsenceForm />
          </div>

          <div className="lg:col-span-7 bg-white rounded-2xl border border-emerald-200 shadow-lg p-6">
            <h3 className="text-xl font-semibold text-emerald-800 mb-6">
              Recent Absences
            </h3>
            <div className="max-h-96 overflow-y-auto">
              <AbsenceList />
            </div>
          </div>

          <div className="lg:col-span-12 bg-white rounded-2xl border border-emerald-200 shadow-lg p-6">
            <AbsenceSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
