import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Fetching profile...');
    const user = await prisma.user.findFirst({
      include: {
        absences: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const totalAbsences = user.absences.length;
    const subjectCounts = user.absences.reduce((acc: { [key: string]: number }, curr) => {
      acc[curr.subject] = (acc[curr.subject] || 0) + 1;
      return acc;
    }, {});

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
      } : undefined
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}