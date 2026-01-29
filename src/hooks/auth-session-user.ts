import { getSessionUser } from '@/api/session-user';
import { useUserStore } from '@/store/user-store';
import { isRedirect, redirect } from '@tanstack/react-router';

export async function authSessionUser() {
  const { user, setUser, clearUser } = useUserStore.getState();

  if (user) {
    return user;
  }

  try {
    const sessionUser = await getSessionUser();

    setUser(sessionUser);
    return sessionUser;
  } catch (error) {
    clearUser();
    console.log(error, 'Error fetching session user');
    throw redirect({
      to: '/sing-in',
    });
  }
}

export async function requireGuest() {
  const { user, setUser } = useUserStore.getState();

  if (user) {
    throw redirect({ to: '/home' });
  }

  try {
    const sessionUser = await getSessionUser();
    setUser(sessionUser);

    throw redirect({ to: '/home' });
  } catch (err) {
    // 🔑 se for redirect, repassa
    if (isRedirect(err)) {
      throw err;
    }

    // erro real (401) → pode acessar
    return null;
  }
}
