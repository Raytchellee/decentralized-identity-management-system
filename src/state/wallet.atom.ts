import { atom } from 'recoil';

export const ConnectWalletVisibleAtom = atom<boolean>({
  key: 'connectWalletVisible',
  default: false,
});
