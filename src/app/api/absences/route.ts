import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

// Use PrismaClient as a singleton for better performance
const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Get authenticated user
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ 
      cookies: () => cookieStore 
    });
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('GET absences - Auth user:', user);
    
    // If there's no authenticated user or an error
    if (authError || !user) {
      // Return all absences for debugging purposes
      console.log('No authenticated user, returning all absences');
      const allAbsences = await prisma.absence.findMany({
        orderBy: { date: 'desc' },
      });
      return NextResponse.json(allAbsences);
    }

    // Try to find prisma user that matches the auth user
    const prismaUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id: user.id },
          { email: user.email }
        ]
      }
    });
    
    // If we found a matching user, use their ID
    if (prismaUser) {
      const absences = await prisma.absence.findMany({
        where: { userId: prismaUser.id },
        orderBy: { date: 'desc' },
      });
      return NextResponse.json(absences);
    }
    
    // If we didn't find a matching user, return empty array
    return NextResponse.json([]);
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

    // Try to find user by both ID and email
    let prismaUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id: user.id },
          { email: user.email || '' }
        ]
      }
    });

    // If user doesn't exist in Prisma DB, create them
    if (!prismaUser) {
      console.log('Creating user in Prisma DB');
      try {
        prismaUser = await prisma.user.create({
          data: {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || '',
            password: '', // We don't store the actual password
          },
        });
      } catch (userError) {
        console.error('Error creating user:', userError);
        return NextResponse.json({ 
          error: 'Failed to create user record',
          details: userError instanceof Error ? userError.message : String(userError)
        }, { status: 500 });
      }
    }

    if (!prismaUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('Using Prisma user:', prismaUser);

    // Create the absence record using the Prisma user's ID
    const absence = await prisma.absence.create({
      data: {
        subject,
        date: new Date(date),
        reason: reason || null,
        userId: prismaUser.id, // Use the Prisma user's ID instead of Supabase user ID
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