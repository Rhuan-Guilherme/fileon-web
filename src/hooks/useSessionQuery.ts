import { getSessionUser } from '@/api/session-user';
import { useUserStore } from '@/store/user-store';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export function useSessionQuery() {
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  const { data, isError, isSuccess, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: getSessionUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (isSuccess) {
      setUser(data);
    }

    if (isError) {
      clearUser();
    }
  }, [isSuccess, isError, data, setUser, clearUser]);

  return { data, isLoading };
}
