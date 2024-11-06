'use client';

import { useSetRecoilState } from 'recoil';
import styles from './index.module.scss';
import { ConnectWalletVisibleAtom } from '@/state';
import { useWallet } from '@txnlab/use-wallet';
import { AlgorandIcon } from '@/assets';

export const TopNav = () => {
  const setConnectWallet = useSetRecoilState(ConnectWalletVisibleAtom);
  const { activeAddress, providers } = useWallet();

  return (
    <nav className={styles.container}>
      <div className={styles.left}>
        <AlgorandIcon />
      </div>
      <div className={styles.right}>
        <button
          onClick={() => {
            if (activeAddress) {
              for (const provider of providers || []) {
                try {
                    provider.disconnect();
                } catch (e) {
                    console.error(e);
                }
              }
            } else {
              setConnectWallet(true);
            }
          }}
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        >
          {activeAddress ? `${activeAddress.slice(0, 10)}...` : 'Connect Wallet'}
        </button>
      </div>
    </nav>
  );
};
