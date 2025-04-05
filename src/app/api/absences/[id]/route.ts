import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id;
    console.log('Deleting absence:', id);

    const deletedAbsence = await prisma.absence.delete({
      where: { id },
    });

    console.log('Deleted absence:', deletedAbsence);
    return NextResponse.json(deletedAbsence);
  } catch (error) {
    console.error('Error deleting absence:', error);
    return NextResponse.json(
      { error: 'Failed to delete absence' },
      { status: 500 }
    );
  }
}