import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/', '/opengraph-image.png', '/icon', '/apple-icon', '/tree'],
});

export const config = {
  matcher: [],
};
