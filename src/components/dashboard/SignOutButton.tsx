"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function SignOutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await supabase.auth.signOut();
      router.push("/auth/signin");
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 disabled:opacity-50"
    >
      <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
    </button>
  );
}
