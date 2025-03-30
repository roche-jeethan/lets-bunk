import SignInForm from '@/components/auth/SignInForm';
import Link from 'next/link';

export default function SignIn() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/auth/signup" className="text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}