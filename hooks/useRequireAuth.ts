import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/hooks/redux';

export const useRequireAuth = () => {
  const router = useRouter();
  const { isAuth } = useAppSelector((state) => state.user);
  useEffect(() => {
    if (!isAuth) {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth]);

  return { isAuth };
};
