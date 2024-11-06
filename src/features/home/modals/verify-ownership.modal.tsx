'use client';

import { BackgroundOverlay } from '@/components/background-overlay';
import styles from './index.module.scss';
import { useState } from 'react';
import { useAlgoDidActions } from '@/actions/algo-did';
import toast from 'react-hot-toast';

interface Props {
  onClose: () => void;
}

export const VerifyOwnershipModal = ({ onClose }: Props) => {
  const [did, setDid] = useState('');
  const { verifyOwnershipOfDid } = useAlgoDidActions();

  const verify = async () => {
    try {
      toast.loading('Verifying ownership DID...', { id: 'loader' });
      const response = await verifyOwnershipOfDid(did);
      toast.dismiss('loader');
      toast.success('DID resolved successfully!');

      if (response) {
        toast.success('You are the owner of this DID!');
      } else {
        toast.error('You are not the owner of this DID!');
      }
    } catch (error) {
      toast.dismiss('loader');
      toast.error(`Failed to resolve DID: ${error}`);
    }
  };

  return (
    <BackgroundOverlay onClose={onClose}>
      <div className={styles.container}>
        <div className={styles.title}>
          <h4>Verify ownership of DID</h4>
        </div>
        <div className={styles.content}>
          <div className={styles.form_control}>
            <label>DID</label>
            <input type="text" value={did} onChange={(evt) => setDid(evt.target.value)} />
          </div>
          <button
            onClick={() => verify()}
            disabled={!did}
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            Submit
          </button>
        </div>
      </div>
    </BackgroundOverlay>
  );
};
