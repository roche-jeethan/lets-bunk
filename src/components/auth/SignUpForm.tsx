"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Link from "next/link";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignedUp, setIsSignedUp] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        const response = await fetch("/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            name: null,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError("Failed to create user profile. Please try again.");
          return;
        }

        setIsSignedUp(true);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (isSignedUp) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-emerald-200 dark:border-slate-700 p-8 max-w-md mx-auto">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-emerald-600 dark:text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-emerald-800 dark:text-emerald-200">
            Account Created Successfully!
          </h3>
          <p className="text-emerald-700 dark:text-emerald-300">
            Your account has been created. You can now sign in with your
            credentials.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-6 py-3 bg-emerald-600 dark:bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors shadow-sm"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-emerald-200 dark:border-slate-700 p-8 max-w-md mx-auto">
      <form onSubmit={handleSignUp} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold mb-2 text-emerald-800 dark:text-emerald-200"
            >
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-emerald-300 dark:border-slate-700 rounded-lg focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-900 bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold mb-2 text-emerald-800 dark:text-emerald-200"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
              className="w-full px-4 py-3 border-2 border-emerald-300 dark:border-slate-700 rounded-lg focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-900 bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Create a password"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold mb-2 text-emerald-800 dark:text-emerald-200"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
              className="w-full px-4 py-3 border-2 border-emerald-300 dark:border-slate-700 rounded-lg focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-900 bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Confirm your password"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-red-600 dark:text-red-300 text-sm font-medium">
              {error}
            </p>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-emerald-600 dark:bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
        >
          {loading ? "Creating account..." : "Create Account"}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-emerald-200 dark:border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-300 font-medium">
              Already have an account?
            </span>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-4 py-2 text-emerald-600 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-100 font-medium rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-700 transition-all duration-200"
          >
            Sign in to your account
          </Link>
        </div>
      </form>
    </div>
  );
}
