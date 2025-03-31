import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

// Use PrismaClient as a singleton for better performance
const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Use cookies asynchronously
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ 
      cookies: () => cookieStore 
    });
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    console.log('GET absences - Auth user:', user);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Looking for absences with userId:', user.id);
    
    // Fetch absences for the authenticated user
    const absences = await prisma.absence.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
    });
    
    console.log('Found absences:', absences);

    return NextResponse.json(absences);
  } catch (error) {
    console.error('Error fetching absences:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Create new Supabase client for this request with async cookies
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ 
      cookies: () => cookieStore 
    });
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('Auth user:', user);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { subject, date, reason } = body;

    // First check if user exists in Prisma DB
    let prismaUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    // If user doesn't exist in Prisma DB, create the user first
    if (!prismaUser) {
      console.log('Creating user in Prisma DB');
      prismaUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || '',
          password: '', // We don't store the actual password since Supabase handles auth
        },
      });
    }

    console.log('Prisma user:', prismaUser);

    // Create the absence record
    const absence = await prisma.absence.create({
      data: {
        subject,
        date: new Date(date),
        reason,
        userId: user.id,
      },
    });

    return NextResponse.json(absence, { status: 201 });
  } catch (error) {
    console.error('Error creating absence:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}