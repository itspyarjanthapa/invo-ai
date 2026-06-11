import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";
import { NextResponse } from "next/server";


export async function GET(req: Request, {
    params
}: {params: {clientId: string}}){

    const {userId} = await auth()

    if(!userId){
        return NextResponse.json({error: 'unauthorized'}, {status:401})
    }

    const user = await prisma.user.findUnique({
        where: {clerkId: userId}
    })

    if(!user){
        return NextResponse.json({error: 'user not found'}, {status: 404})
    }

    const client = await prisma.client.findFirst({
        where: {
            id: params.clientId,
            userId: user.id
        }
    })

    if(!client){
        return NextResponse.json({
            error: 'client not found'
        }, {status:400})
    }

    return NextResponse.json(client)
}

// update client
export async function PUT(req: Request, {params}: {params : {clientId: string}}) {
    const {userId} = await auth()

    if(!userId){
        return NextResponse.json({error: 'unauthorized'}, {status: 401})
    }

    const user = await prisma.user.findUnique({
        where: {
            clerkId: userId,
        }
    })

    if(!user){
        return NextResponse.json({error: "user not found"}, {status: 404})
    }

    const {name, email, phone, address, company} = await req.json()
    
    const client = await prisma.client.updateMany(
        {
            where:{
              id: params.clientId,
              userId: user.id
        },
        data:{
            name,
            email,
            phone,
            address,
            company
        }
    })

    if(client.count === 0){
        return NextResponse.json({error: 'client not found'}, {status: 404})
    }

    return NextResponse.json(client)
}

// Delete client
export async function DELETE(req: Request, {params}: {params : {clientId: string}}) {
    const {userId} = await auth()

    if(!userId){
        return NextResponse.json({
            error: 'unauthorized'
        }, {status: 401})
    }

    const user = await prisma.user.findUnique({
        where: {clerkId: userId}
    })

    if(!user){
        return NextResponse.json({
            error: 'user not found'
        }, {status: 404})
    }

    await prisma.client.deleteMany({
        where:{ id: params.clientId, userId: user.id}
    })

    return NextResponse.json({success: true})
}