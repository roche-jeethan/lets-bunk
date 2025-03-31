import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function Home() {
  try {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    
    // Use getUser instead of getSession for better security
    const { data: { user }, error } = await supabase.auth.getUser();

    if (user && !error) {
      redirect('/dashboard');
    }

    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-white to-gray-50">
        <div className="w-full max-w-4xl px-4 text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-gray-900 animate-fade-in">
              Track Your Class Attendance
              <span className="block text-blue-600 mt-2">With Ease</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-delay">
              Keep track of your classes and never miss an important session. 
              Simple, efficient, and organized attendance management.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fade-in-delay-2">
            <Link 
              href="/auth/signup"
              className="px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all hover:scale-105"
            >
              Get Started
            </Link>
            <Link 
              href="/auth/signin"
              className="px-8 py-3 text-lg font-medium text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-all hover:scale-105"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-delay-3">
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col items-center">
                <svg className="w-12 h-12 text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">Easy Tracking</h3>
                <p className="text-gray-600">Record and monitor your attendance with just a few clicks</p>
              </div>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col items-center">
                <svg className="w-12 h-12 text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">Detailed Analytics</h3>
                <p className="text-gray-600">Get insights about your attendance patterns</p>
              </div>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col items-center">
                <svg className="w-12 h-12 text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">Never Miss Class</h3>
                <p className="text-gray-600">Stay organized and maintain good attendance</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}