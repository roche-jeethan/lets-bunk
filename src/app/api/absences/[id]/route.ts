import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type Props = {
  params: {
    id: string;
  };
};

export async function DELETE(
  request: Request,
  { params }: Props
) {
  try {
    const id = params.id;
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