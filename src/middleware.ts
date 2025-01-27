import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;

  // Allow static paths and API routes
  const staticPaths = ["/_next/", "/static/", "/api/"];
  if (staticPaths.some((path) => pathName.startsWith(path))) {
    return NextResponse.next();
  }

  // Public routes that do not require authentication
  const publicRoutes = ["/", "/signup", "/login", "/forgetpassword"];
  if (publicRoutes.includes(pathName)) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to the home page ("/")
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow authenticated users to proceed
  return NextResponse.next();
}
