'use client';

import { useWallet } from '@txnlab/use-wallet';
import { BackgroundOverlay } from '../background-overlay';
import { useEffect } from 'react';
import styles from './index.module.scss';

interface Props {
  onClose: () => void;
}

export const WalletConnectModal = ({ onClose }: Props) => {
  const { providers: wallets, activeAddress } = useWallet();

  useEffect(() => {
    if (activeAddress) {
      onClose();
    }
  }, [activeAddress]);

  return (
    <BackgroundOverlay onClose={onClose}>
      <div className={styles.container}>
        <div className={styles.title}>
          <h4>Connect a Wallet</h4>
          <h5>Supported wallets</h5>
        </div>
        <div className={styles.wallets}>
          {wallets?.map((wallet) => (
            <div className={styles.wallet} key={wallet.metadata.id} onClick={wallet.connect}>
              <img src={wallet.metadata.icon} alt={`${wallet.metadata.name} icon`} />
              <span>{wallet.metadata.name}</span>
            </div>
          ))}
        </div>
      </div>
    </BackgroundOverlay>
  );
};
