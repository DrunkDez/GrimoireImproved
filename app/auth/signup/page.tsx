import { SignupForm } from "@/components/auth/signup-form"
import { Toaster } from "@/components/ui/toaster"

export default function SignUpPage() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4 relative z-[1]">
        <SignupForm />
      </div>
      <Toaster />
    </>
  )
}
