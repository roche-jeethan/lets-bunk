import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Check all users
    const users = await prisma.user.findMany();
    console.log('All users:', users);
    
    // Check all absences
    const allAbsences = await prisma.absence.findMany();
    console.log('All absences:', allAbsences);
    
    return NextResponse.json({ 
      users, 
      absences: allAbsences 
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ 
      error: 'Error querying database',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}