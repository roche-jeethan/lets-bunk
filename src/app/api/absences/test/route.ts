import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ 
      cookies: () => cookieStore 
    });
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create a test absence
    const absence = await prisma.absence.create({
      data: {
        subject: "Test Subject",
        date: new Date(),
        reason: "Created by test endpoint",
        userId: user.id,
      },
    });

    return NextResponse.json({
      message: "Test absence created",
      absence,
      userId: user.id
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({ 
      error: 'Error creating test absence',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}