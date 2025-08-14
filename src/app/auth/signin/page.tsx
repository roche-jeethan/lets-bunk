import SignInForm from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-emerald-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-emerald-700">
            Welcome back to LetsBunk
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}
