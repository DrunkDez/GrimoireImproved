import { LoginForm } from "@/components/auth/login-form"
import { Toaster } from "@/components/ui/toaster"

export default function SignInPage() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4 relative z-[1]">
        <LoginForm />
      </div>
      <Toaster />
    </>
  )
}
