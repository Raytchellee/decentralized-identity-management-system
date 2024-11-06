import { Token } from '@/interface';
import { IProfile } from '@/interface/profile.interface';
import { atom } from 'recoil';

export const authAtom = atom<Token | null>({
  default: null,
  key: 'auth-atom',
});

export const profileAtom = atom<IProfile | null>({
  default: null,
  key: 'profile-atom',
});

export const currentViewAtom = atom<'personal' | 'education' | 'health'>({
  default: 'personal',
  key: 'current-view-atom',
});
