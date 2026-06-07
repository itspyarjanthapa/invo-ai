import { SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation'



export default async function Home() {

  const { userId } = await auth()

  if (!userId){
    return(
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Invo-App</h1>
          <p className="mb-6">Smart Financial & Proposal Hub for Freelancers</p>
         <SignUpButton>
                <button className="bg-green-700 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                 Get Started
                </button>
              </SignUpButton>
        </div>
      </div>
    )
  }

  redirect('/dashboard')

}
