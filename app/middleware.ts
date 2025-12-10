import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const middleware = (req: NextRequest) => {
  const token = req.cookies.get("accessToken")?.value;
  const rawRole = req.cookies.get("role")?.value;
  const url = req.nextUrl.pathname;

  // ✅ PUBLIC ROUTES (accessible without login)
  const publicRoutes = ["/", "/about", "/login", "/register"];
  const isPublicRoute = publicRoutes.some(
    (route) => url === route || url.startsWith(route + "/")
  );

  if (isPublicRoute) return NextResponse.next();

  // ✅ NO TOKEN → REDIRECT TO LOGIN
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  // ✅ NORMALIZE ROLE
  const role = rawRole?.toLowerCase();

  if (!role) return NextResponse.redirect(new URL("/login", req.url));

  // ----------------------
  // ✅ ROUTE PROTECTION
  // ----------------------

  // Admin routes
  const adminRoutes = ["/admin",];
  const isAdminRoute = adminRoutes.some(
    (route) => url === route || url.startsWith(route + "/")
  );
  if (isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Seller routes
  const sellerRoutes = ["/seller", "/sellerbooks"];
  const isSellerRoute = sellerRoutes.some(
    (route) => url === route || url.startsWith(route + "/")
  );
  if (isSellerRoute && role !== "seller") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Customer routes
  const customerRoutes = [
    "/categories",
    "/viewbooks",
    "/wishlist",
    "/cart",
    "/vieworders",
    "/profile",
    "/customerprofile",
    "/checkout",
  ];
  const isCustomerRoute = customerRoutes.some(
    (route) => url === route || url.startsWith(route + "/")
  );
  if (isCustomerRoute && role !== "customer") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // ✅ ALLOW ALL OTHER ROUTES
  return NextResponse.next();
};

// ----------------------
// ✅ CONFIG
// ----------------------
export const config = {
  matcher: ["/((?!_next|favicon.ico|api|static|assets).*)"],
};
