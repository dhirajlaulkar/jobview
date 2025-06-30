import { authMiddleware } from "@clerk/nextjs";

// This middleware protects routes starting with `/admin` and allows all other routes to be public.
export default authMiddleware({
  publicRoutes: [
    "/",
    "/jobs",
    "/jobs/live",
    "/jobs/(.*)",
    "/api/jobs",
    "/api/jobs/live",
    "/api/jobs/remote",
    "/api/jobs/(.*)",
  ],
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: [ '/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};