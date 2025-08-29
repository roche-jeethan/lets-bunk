"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggler from "./ThemeButton";

export default function Navbar() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (outcome === "accepted") {
      setIsInstallable(false);
    }
  };

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-emerald-200 dark:border-slate-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/icon-512x512.png"
                alt="LetsBunk Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-xl font-bold text-emerald-900 dark:text-emerald-100">
                LetsBunk
              </span>
            </Link>
          </div>
          <div className="hidden sm:flex sm:items-center sm:gap-4">
            {isInstallable && (
              <button
                onClick={handleInstallClick}
                className="px-4 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-600 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
              >
                Install App
              </button>
            )}
            <Link
              href="/auth/signin"
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 dark:bg-emerald-500 rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors"
            >
              Sign In
            </Link>
            <ThemeToggler />
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100 hover:bg-emerald-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-slate-900 border-t border-emerald-200 dark:border-slate-700">
          <div className="pt-2 pb-3 space-y-1">
            <div className="px-4 py-3 flex flex-col gap-2">
              {isInstallable && (
                <button
                  onClick={handleInstallClick}
                  className="w-full px-4 py-2 text-center text-sm font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-600 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Install App
                </button>
              )}
              <Link
                href="/auth/signin"
                className="w-full px-4 py-2 text-center text-sm font-medium text-white bg-emerald-600 dark:bg-emerald-500 rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors"
              >
                Sign In
              </Link>
              <ThemeToggler />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
