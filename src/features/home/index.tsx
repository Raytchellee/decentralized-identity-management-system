'use client';

import { AlgorandIcon } from '@/assets';
import { useWallet } from '@txnlab/use-wallet';
import styles from './index.module.scss';
import { TopNav } from '@/components/top-nav';
import { useAlgoDidActions } from '@/actions/algo-did';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CreateDidModal } from './modals/create-did.modal';
import { DeleteDidModal } from './modals/delete-did.modal';
import { ResolveDidModal } from './modals/resolve-did-modal';
import { VerifyOwnershipModal } from './modals/verify-ownership.modal';

export const Home = () => {
  const [loading, setLoading] = useState(false);
  const { deploySmartContract } = useAlgoDidActions();
  const [modal, setModal] = useState<
    'create-did' | 'delete-did' | 'resolve-did' | 'verify-ownership'
  >();
  const { activeAddress } = useWallet();

  const handleDeploySmartContract = async () => {
    if (loading) return;

    setLoading(true);
    toast.loading('Deploying decentralized id smart contract...', { id: 'loader' });

    try {
      const response = await deploySmartContract();

      toast.success(`Smart contract deployed successfully! APP ID: ${response.appId}`);
      setLoading(false);
      toast.dismiss('loader');
    } catch (error: any) {
      setLoading(false);
      toast.error(`Error deploying smart contract:, ${error.toString()}`);
      toast.dismiss('loader');
    }
  };

  return (
    <>
      <TopNav />
      <div className={styles.container}>
        <main>
          <AlgorandIcon className={styles.AlgorandIcon} />
          <ul>
            <li>Welcome to the Next.JS Template for Algorand.</li>
            <li>
              {activeAddress
                ? `Your wallet address is: ${activeAddress.slice(0, 10)}...`
                : `Get started by connecting your wallet.`}
            </li>
          </ul>

          {!!activeAddress && (
            <div className={styles['button-group']}>
              <button
                onClick={handleDeploySmartContract}
                disabled={loading}
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              >
                Deploy smart contract
              </button>

              <button
                onClick={() => setModal('create-did')}
                disabled={loading}
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              >
                Create DiD
              </button>
            </div>
          )}

          {!!activeAddress && (
            <div className={styles['button-group']}>
              <button
                onClick={() => setModal('resolve-did')}
                disabled={loading}
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              >
                Resolve DiD
              </button>

              <button
                onClick={() => setModal('delete-did')}
                disabled={loading}
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              >
                Delete DiD
              </button>
            </div>
          )}

          {!!activeAddress && (
            <div className={styles['button-group']}>
              <button
                onClick={() => setModal('verify-ownership')}
                disabled={loading}
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              >
                Verify ownership
              </button>
            </div>
          )}
        </main>
      </div>

      {modal === 'create-did' && <CreateDidModal onClose={() => setModal(undefined)} />}
      {modal === 'delete-did' && <DeleteDidModal onClose={() => setModal(undefined)} />}
      {modal === 'resolve-did' && <ResolveDidModal onClose={() => setModal(undefined)} />}
      {modal === 'verify-ownership' && <VerifyOwnershipModal onClose={() => setModal(undefined)} />}
    </>
  );
};
