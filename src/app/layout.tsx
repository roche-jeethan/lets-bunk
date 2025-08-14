import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LetsBunk! - Absence Counter App",
  description:
    "LetsBunk! - Absence Counter App is an open-source web application that helps you track and manage absences in your organization. It provides a user-friendly interface for employees to report their absences and for managers to monitor and analyze absence trends.",
  openGraph: {
    title: "LetsBunk! - Absence Counter App",
    description:
      "LetsBunk! - Absence Counter App is an open-source web application that helps you track and manage absences in your organization. It provides a user-friendly interface for employees to report their absences and for managers to monitor and analyze absence trends.",
    url: "https://letsbunk.vercel.app",
    siteName: "LetsBunk! - Absence Counter App",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
