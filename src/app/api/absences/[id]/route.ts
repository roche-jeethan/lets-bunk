import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Access params asynchronously by awaiting the promise
    const params = await context.params;
    const id = params.id;
    
    console.log('Deleting absence:', id);

    // Make sure id is a string before using it
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid absence ID' },
        { status: 400 }
      );
    }

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