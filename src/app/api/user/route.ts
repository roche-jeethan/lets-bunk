import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request){
    try {
        const {email, name} = await request.json();
        const user = await prisma.user.create({
            data:{
                email, name, password: '',
            },
        });

        return NextResponse.json({user}, {status: 201});
    } catch(error){
        console.log('Error creating user:', error);
        return NextResponse.json({error: 'Error creating user'}, {status: 500});
    }
}