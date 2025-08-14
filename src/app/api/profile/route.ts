import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile from database using Prisma
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        absences: {
          select: {
            subject: true,
          },
        },
      },
    });

    if (!profile) {
      console.error("Profile not found for user:", user.id);
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const totalAbsences = profile.absences.length;

    // Calculate most missed subject
    let mostMissedSubject = null;
    if (profile.absences.length > 0) {
      const subjectCounts = profile.absences.reduce(
        (acc: Record<string, number>, absence) => {
          acc[absence.subject] = (acc[absence.subject] || 0) + 1;
          return acc;
        },
        {}
      );

      const mostMissed = Object.entries(subjectCounts).reduce((a, b) =>
        subjectCounts[a[0]] > subjectCounts[b[0]] ? a : b
      );

      mostMissedSubject = {
        subject: mostMissed[0],
        count: mostMissed[1],
      };
    }

    return NextResponse.json({
      email: profile.email,
      name: profile.name,
      created_at: profile.createdAt.toISOString(),
      totalAbsences,
      mostMissedSubject,
    });
  } catch (error) {
    console.error("Unexpected error in profile API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
