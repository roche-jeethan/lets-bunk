import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full max-w-4xl px-4 text-center space-y-8">
        <h1 className="text-5xl font-bold text-gray-900">
          Track Your Class Attendance
          <span className="block text-blue-600 mt-2">With Ease</span>
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Keep track of your classes and never miss an important session. 
          Simple, efficient, and organized attendance management.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link 
            href="/auth/signup"
            className="px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <Link 
            href="/auth/signin"
            className="px-8 py-3 text-lg font-medium text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Easy Tracking</h3>
            <p className="text-gray-600">Record and monitor your attendance with just a few clicks</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Detailed Analytics</h3>
            <p className="text-gray-600">Get insights about your attendance patterns</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Never Miss Class</h3>
            <p className="text-gray-600">Stay organized and maintain good attendance</p>
          </div>
        </div>
      </div>
    </main>
  );
}