import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Fetching absences...');
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
    return NextResponse.json(absences);
  } catch (error) {
    console.error('Error fetching absences:', error);
    return NextResponse.json({ error: 'Failed to fetch absences' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Creating absence:', body);
    
    const { subject, date, reason } = body;

    const absence = await prisma.absence.create({
      data: {
        subject,
        date: new Date(date),
        reason: reason || null,
        // For now, use the first user
        userId: (await prisma.user.findFirst())?.id || '',
      },
    });

    console.log('Created absence:', absence);
    return NextResponse.json(absence, { status: 201 });
  } catch (error) {
    console.error('Error creating absence:', error);
    return NextResponse.json({ error: 'Failed to create absence' }, { status: 500 });
  }
}