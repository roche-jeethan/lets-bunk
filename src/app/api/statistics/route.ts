import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Fetching statistics...');
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

    const totalAbsences = absences.length;
    const subjectCounts = absences.reduce((acc: { [key: string]: number }, curr) => {
      acc[curr.subject] = (acc[curr.subject] || 0) + 1;
      return acc;
    }, {});

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

    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}