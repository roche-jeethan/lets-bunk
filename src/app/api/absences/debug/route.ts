import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Running debug checks...');
    
    const users = await prisma.user.findMany();
    console.log('All users:', users);
    
    const allAbsences = await prisma.absence.findMany();
    console.log('All absences:', allAbsences);
    
    return NextResponse.json({ 
      users, 
      absences: allAbsences 
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}