import { LoginForm } from "@/components/auth/login-form"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"

export default function SignInPage() {
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
          <LoginForm />
          
          {/* Forgot Password Link */}
          <div className="text-center">
            <Link href="/auth/forgot-password">
              <Button variant="link" className="text-sm">
                Forgot your password?
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  )
}