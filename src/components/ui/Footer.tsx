import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-emerald-200 shadow-sm mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="flex items-center">
              <span className="text-lg font-semibold text-emerald-800">
                LetsBunk
              </span>
            </div>
            <p className="text-sm text-emerald-600">
              Track your attendance with ease
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end space-y-2">
            <div className="flex space-x-4">
              <Link
                href="/privacy"
                className="text-sm text-emerald-700 hover:text-emerald-900 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-emerald-700 hover:text-emerald-900 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/contact"
                className="text-sm text-emerald-700 hover:text-emerald-900 transition-colors"
              >
                Contact
              </Link>
            </div>
            <p className="text-sm text-emerald-600">
              © {currentYear} LetsBunk. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
