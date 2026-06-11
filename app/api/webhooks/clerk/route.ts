
import { WebhookEvent } from "@clerk/nextjs/server"
import { headers } from "next/headers"
import { Webhook } from "svix"
import { prisma } from "../../../../lib/prisma"


export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
    
    if(!WEBHOOK_SECRET) {
        throw new Error('Please add CLERK_WEBHOOK_SECRET TO .env')
    }

    const headerPayload = await headers()
    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')

    if (!svix_id || !svix_timestamp || !svix_signature){
        return new Response('ERROR: Missing svix headers', {status:400})
    }

    const payload = await req.json()
    const body = JSON.stringify(payload)

    const webhook = new Webhook(WEBHOOK_SECRET)
    let event: WebhookEvent

    try{
        event = webhook.verify(body,{
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature
        })as WebhookEvent
    }catch(err){
        console.error('Error verifying webhook:', err)
        return new Response('Error: Invalid webhook', {status:400})
    }

    const eventType = event.type

    if (eventType === 'user.created'){
        const {id, email_addresses, first_name, last_name} = event.data

        const email = email_addresses[0]?.email_address

        if(!email){
            return new Response('Error: No email found', {status:400})
        }

        await prisma.user.create({
            data: {
                clerkId: id,
                email: email,
                name: `${first_name || ''} ${last_name || ''}`.trim() || null
            },
        })
        console.log(`User created in database: ${email}`)
    }

    if(eventType === 'user.deleted'){
        const {id} = event.data

        await prisma.user.delete({
            where: {clerkId: id}
        })
        console.log(`user deleted from database: ${id}`)
    }

    return new Response('Webhook received', {status:200} )

}