import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/", "/login", "/register", "/about"];

const adminRoutes = ["/admin"];

const sellerRoutes = [
  "/sellerdashboard",
  "/addbook",
  "/sellerprofile",
  "/sellerorders",
  "/sellerbooks",
  "/sellersingleorder",
  "/updatebook",
 
];

const customerRoutes = [
  "/checkout",
  "/customerprofile",
  "/viewbooks",
  "/vieworders",
  "/cart",
  "/wishlist",
 
];

const sharedRoutes = ["/viewonebook","/editprofile"]; 

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("accessToken")?.value;
  const role = request.cookies.get("role")?.value;


  // Public routes
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Shared routes are accessible by all logged-in users
  const isSharedRoute = sharedRoutes.some((route) => pathname.startsWith(route));
  if (!isSharedRoute) {
    // Role-based checks
    if (adminRoutes.some((route) => pathname.startsWith(route)) && role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    if (sellerRoutes.some((route) => pathname.startsWith(route)) && role !== "seller") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    if (customerRoutes.some((route) => pathname.startsWith(route)) && role !== "customer") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|assets|api).*)"],
};
