import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";
import { NextResponse } from "next/server";

// Get All clients for logged-in user
export async function GET() {
    const {userId} = await auth()

    if(!userId) {
        return NextResponse.json({error: 'unauthorized'}, {status:401})
    }
    
    const user = await prisma.user.findUnique({
        where: {clerkId: userId}
    })

    if(!user){
        return NextResponse.json({error: 'User not found'}, {status: 404})
    }

    const clients = await prisma.client.findMany({
        where: {userId: user.id},
        orderBy: {createdAt: 'desc'}
    })

    return NextResponse.json(clients)
}


// Post - Create a new client
export async function POST(req: Request) {
    const {userId} = await auth()

    if(!userId){
        return NextResponse.json({error: 'unauthorized'}, {status: 401})
    }

    const user = await prisma.user.findUnique({
        where: {clerkId: userId}
    })

    if(!user) {
        return NextResponse.json({error: 'user not found'}, {status: 404})
    }

    const {name, email, company, address, phone} = await req.json()

    const client = await prisma.client.create({
        data:{
            name,
            email,
            address,
            company,
            phone,
            userId: user.id
        }
    })

    return NextResponse.json(client)
}

//