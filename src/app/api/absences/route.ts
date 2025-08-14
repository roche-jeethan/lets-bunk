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

    const absences = await prisma.absence.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      take: 20,
    });

    return NextResponse.json({ absences });
  } catch (error) {
    console.error("Error fetching absences:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { subject, date, reason } = body;

    if (!subject || !date) {
      return NextResponse.json(
        { error: "Subject and date are required" },
        { status: 400 }
      );
    }

    const absence = await prisma.absence.create({
      data: {
        subject,
        date: new Date(date),
        reason: reason || null,
        userId: user.id,
      },
    });

    return NextResponse.json({ absence }, { status: 201 });
  } catch (error) {
    console.error("Error creating absence:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
