// Temporarily disabled authentication to allow profile access without login
// export { default } from 'next-auth/middleware';

// export const config = {
//   matcher: ['/profile', '/saved'],
// };

export function middleware() {
  // No authentication required for now
  return;
}

