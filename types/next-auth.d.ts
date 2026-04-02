import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string | null
      isAdmin: boolean // 🔒 NEW
    }
  }

  interface User {
    id: string
    email: string
    name: string | null
    isAdmin: boolean // 🔒 NEW
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    isAdmin: boolean // 🔒 NEW
  }
}