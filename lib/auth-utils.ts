import { auth } from './auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const getSession = async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
};

export const RequireAuth = async () => {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  return session;
};

export const RedirectIfAuthenticated = async () => {
  const session = await getSession();
  if (session) {
    redirect('/');
  }
  return session;
};
