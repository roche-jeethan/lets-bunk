import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-emerald-900 dark:text-emerald-100">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-300">
            Join LetsBunk to track your absences
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
