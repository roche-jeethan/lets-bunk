import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('Fetching statistics...');

    // Get all absences (we'll implement user-specific filtering later)
    const absences = await prisma.absence.findMany({
      orderBy: { date: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    console.log(`Found ${absences.length} absences`);

    // Calculate statistics
    const totalAbsences = absences.length;
    
    // Count absences by subject
    const subjectCounts = absences.reduce((acc: { [key: string]: number }, curr) => {
      acc[curr.subject] = (acc[curr.subject] || 0) + 1;
      return acc;
    }, {});

    console.log('Subject counts:', subjectCounts);

    // Find most missed subject
    const mostMissedSubject = Object.entries(subjectCounts)
      .sort(([,a], [,b]) => b - a)[0];

    const statistics = {
      totalAbsences,
      mostMissedSubject: mostMissedSubject ? {
        subject: mostMissedSubject[0],
        count: mostMissedSubject[1]
      } : null,
      lastAbsence: absences[0] || null,
      absenceHistory: absences,
      subjectCounts
    };

    console.log('Computed statistics:', statistics);

    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}