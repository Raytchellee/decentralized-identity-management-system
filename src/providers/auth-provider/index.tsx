'use client';

import { authAtom } from '@/state';
import { useWallet } from '@txnlab/use-wallet';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { Loader } from './loader';

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [loading, setLoading] = useState(true);
  const { push } = useRouter();
  const pathname = usePathname();
  const setAuth = useSetRecoilState(authAtom);
  const { providers: wallets } = useWallet();

  const disconnectWallet = () => {
    for (const wallet of wallets || []) {
      wallet.disconnect();
    }

    localStorage.clear();
  };

  const checkAuth = () => {
    setLoading(true);
    const authFromStorage = localStorage.getItem('auth');

    if (!authFromStorage) {
      disconnectWallet();
      push('/');
      setLoading(false);
      return;
    }

    try {
      const auth = JSON.parse(authFromStorage);

      if (auth.accessToken) {
        setAuth(auth);
        setLoading(false);

        if (pathname === '/') {
          push('/profile');
        }
      } else {
        disconnectWallet();
        push('/');
        setLoading(false);
      }
    } catch (error) {
      disconnectWallet();
      push('/');
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return loading ? <Loader /> : <>{children}</>;
};
