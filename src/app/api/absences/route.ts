import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const absences = await prisma.absence.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(absences);
  } catch (error) {
    console.error('Error fetching absences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { subject, date, reason, userId } = body;

    const absence = await prisma.absence.create({
      data: {
        subject,
        date: new Date(date),
        reason,
        userId,
      },
    });

    return NextResponse.json(absence, { status: 201 });
  } catch (error) {
    console.error('Error creating absence:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}