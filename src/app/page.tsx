import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex flex-grow flex-col items-center justify-center bg-gradient-to-b from-emerald-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="w-full max-w-4xl px-4 text-center space-y-8">
          <h1 className="text-5xl mt-4 font-bold text-emerald-900 dark:text-emerald-100">
            Track Your Class Attendance
            <span className="block text-emerald-600 dark:text-emerald-400 mt-2">
              With Ease
            </span>
          </h1>

          <p className="text-xl text-emerald-700 dark:text-emerald-300 max-w-2xl mx-auto">
            Keep track of your classes and never miss an important session.
            Simple, efficient, and organized attendance management.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/auth/signup"
              className="px-8 py-3 text-lg font-medium text-white bg-emerald-600 dark:bg-emerald-500 rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/auth/signin"
              className="px-8 py-3 text-lg font-medium text-emerald-700 dark:text-emerald-300 border-2 border-emerald-600 dark:border-emerald-500 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-emerald-100 dark:border-slate-700 dark:shadow-slate-900/20">
              <h3 className="text-xl font-semibold mb-2 text-emerald-800 dark:text-emerald-200">
                Easy Tracking
              </h3>
              <p className="text-emerald-700 dark:text-emerald-300">
                Record and monitor your attendance with just a few clicks
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-emerald-100 dark:border-slate-700 dark:shadow-slate-900/20">
              <h3 className="text-xl font-semibold mb-2 text-emerald-800 dark:text-emerald-200">
                Detailed Analytics
              </h3>
              <p className="text-emerald-700 dark:text-emerald-300">
                Get insights about your attendance patterns
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-emerald-100 dark:border-slate-700 dark:shadow-slate-900/20">
              <h3 className="text-xl font-semibold mb-2 text-emerald-800 dark:text-emerald-200">
                Never Miss Class
              </h3>
              <p className="text-emerald-700 dark:text-emerald-300">
                Stay organized and maintain good attendance
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
