import { createAuthClient } from 'better-auth/react';

const appBaseURL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000';
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: appBaseURL,
});
