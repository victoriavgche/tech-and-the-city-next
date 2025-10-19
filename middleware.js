export { default } from "next-auth/middleware";

// Protect these routes with authentication
export const config = {
  matcher: [
    "/admin/:path*",
    "/admin-TC25/:path*",
    "/admin-mobile/:path*",
    "/admin-test/:path*",
    "/admin-db/:path*",
    "/backup/:path*",
    "/backup-info/:path*",
    "/backup-viewer/:path*",
  ],
};

