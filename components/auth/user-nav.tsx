"use client"

import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, BookUser, Star, BookOpen } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function UserNav() {
  const { data: session } = useSession()
  const router = useRouter()

  if (!session) {
    return (
      <div className="flex gap-2">
        <Link href="/auth/signin">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </Link>
        <Link href="/auth/signup">
          <Button size="sm">Sign Up</Button>
        </Link>
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/")
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <User className="w-4 h-4" />
          <span className="hidden md:inline">
            {session.user?.name || session.user?.email}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer">
            <BookUser className="w-4 h-4 mr-2" />
            My Characters
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/character-creation" className="cursor-pointer">
            <BookOpen className="w-4 h-4 mr-2" />
            Character Creation Guide
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/merits-flaws" className="cursor-pointer">
            <Star className="w-4 h-4 mr-2" />
            Merits & Flaws
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/recommended" className="cursor-pointer">
            <BookOpen className="w-4 h-4 mr-2" />
            Resources
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
