import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
    const { userId } = await auth();

    if (userId) {
        // Query to check if the user is in our database
        const dbUser = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!dbUser) {
            const userFromClerk = await currentUser();
            if (userFromClerk) {
                const email = userFromClerk.emailAddresses[0]?.emailAddress || '';
                const name = `${userFromClerk.firstName || ''} ${userFromClerk.lastName || ''}`.trim();
                
                await prisma.user.create({
                    data: {
                        clerkId: userId,
                        email: email,
                        name: name || null,
                    },
                });
                console.log('✅ User successfully synced on dashboard visit:', email);
            }
        }
    }

    return(
        <div className="min-h-screen bg-gray-100 text-black">
      <nav className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Invo-App Dashboard</h1>
          <UserButton/>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Welcome, Freelancer!</h2>
        <p>User ID: {userId}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Invoices</h3>
            <p className="text-3xl font-bold text-blue-600">$0</p>
            <p>Total outstanding</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Clients</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
            <p>Active clients</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Proposals</h3>
            <p className="text-3xl font-bold text-purple-600">0</p>
            <p>Sent this month</p>
          </div>
        </div>
      </main>
    </div>
    )
}