import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequestWithAuth } from "next-auth/middleware"

export default auth((req: NextRequestWithAuth) => {
  const isLoggedIn = !!req.auth
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/generate")

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/generate"]
}