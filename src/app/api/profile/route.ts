import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('Fetching profile data...');

    // For now, get the first user (we'll implement proper auth later)
    const user = await prisma.user.findFirst({
      include: {
        absences: true,
      },
    });

    if (!user) {
      console.log('No user found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('Found user:', user.email);

    // Calculate statistics
    const totalAbsences = user.absences.length;
    
    // Count absences by subject
    const subjectCounts = user.absences.reduce((acc: { [key: string]: number }, curr) => {
      acc[curr.subject] = (acc[curr.subject] || 0) + 1;
      return acc;
    }, {});

    // Find most missed subject
    const mostMissedSubject = Object.entries(subjectCounts)
      .sort(([,a], [,b]) => b - a)[0];

    const profile = {
      email: user.email,
      name: user.name,
      created_at: user.createdAt,
      totalAbsences,
      mostMissedSubject: mostMissedSubject ? {
        subject: mostMissedSubject[0],
        count: mostMissedSubject[1]
      } : null
    };

    console.log('Computed profile data:', profile);

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}