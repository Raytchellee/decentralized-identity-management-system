import { useClient } from '@/hooks/use-client';
import { Token } from '@/interface';
import {
  EducationInfoDto,
  HealthInfoDto,
  IProfile,
  PersonalInfoDto,
} from '@/interface/profile.interface';
import { authAtom, profileAtom } from '@/state';
import { useWallet } from '@txnlab/use-wallet';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useSetRecoilState } from 'recoil';

export const useAuthActions = () => {
  const client = useClient();
  const setAuth = useSetRecoilState(authAtom);
  const setProfile = useSetRecoilState(profileAtom);
  const { push } = useRouter();
  const { providers: wallets } = useWallet();

  const login = useCallback(async (txnBase64: string, did: string) => {
    const response = await client.post<Token>('/did/auth/login', {
      txnBase64,
      did,
    });

    if (response.data?.accessToken) {
      localStorage.setItem('auth', JSON.stringify(response.data));
      setAuth(response.data);
      return response.data;
    }

    toast.error(String(response.error));
  }, []);

  const disconnectWallet = useCallback(async (refreshBrowser?: boolean) => {
    for (const wallet of wallets || []) {
      await wallet.disconnect();
    }

    localStorage.clear();

    if (refreshBrowser) {
      return window.location.reload();
    }
  }, []);

  const getProfile = async () => {
    const url = `/did/profile`;
    const response = await client.get<IProfile>(url);

    if (response.data) {
      setProfile(response.data);
      return response.data;
    }

    toast.error(String(response.error));
  };

  const createOrUpdatePersonalInfo = async (dto: Partial<PersonalInfoDto>) => {
    const url = `/did/profile/personal-information`;
    const response = await client.put<IProfile>(url, dto);

    if (response.data) {
      setProfile(response.data);
      return response.data;
    }

    toast.error(String(response.error));
  };

  const createOrUpdateHealthInfo = async (dto: Partial<HealthInfoDto>) => {
    const url = `/did/profile/health-information`;
    const response = await client.put<IProfile>(url, dto);

    if (response.data) {
      setProfile(response.data);
      return response.data;
    }

    toast.error(String(response.error));
  };

  const createOrUpdateEducationInfo = async (dto: Partial<EducationInfoDto>) => {
    const url = `/did/profile/education-information`;
    const response = await client.put<IProfile>(url, dto);

    if (response.data) {
      setProfile(response.data);
      return response.data;
    }

    toast.error(String(response.error));
  };

  return {
    login,
    disconnectWallet,
    getProfile,
    createOrUpdatePersonalInfo,
    createOrUpdateHealthInfo,
    createOrUpdateEducationInfo,
  };
};
