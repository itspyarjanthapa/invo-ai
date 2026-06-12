import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { UserButton } from "@clerk/nextjs";
import ClientsForm from "./components/clients";


export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return <div>Please login</div>;
  }

  // Get or create user from Clerk
  const userFromClerk = await currentUser();

  if (userFromClerk) {
    const email = userFromClerk.emailAddresses[0]?.emailAddress || "";
    const name =
      `${userFromClerk.firstName || ""} ${userFromClerk.lastName || ""}`.trim();

    // ✅ Use upsert instead of create
    await prisma.user.upsert({
      where: {
        email: email, // Find by email
      },
      update: {
        // Update these fields if user exists
        clerkId: userId,
        name: name || null,
      },
      create: {
        // Create new user if doesn't exist
        clerkId: userId,
        email: email,
        name: name || null,
      },
    });

    console.log("✅ User synced successfully:", email);
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <nav className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Invo-App Dashboard</h1>

          <UserButton />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <ClientsForm/>
      </main>
    </div>
  );
}
