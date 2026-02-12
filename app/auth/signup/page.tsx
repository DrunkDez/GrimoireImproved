import { SignupForm } from "@/components/auth/signup-form"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4 relative z-[1]">
        <div className="w-full max-w-md space-y-4">
          <div className="flex justify-center">
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <Home className="w-4 h-4" />
                Back to Grimoire
              </Button>
            </Link>
          </div>
          <SignupForm />
        </div>
      </div>
      <Toaster />
    </>
  )
}
