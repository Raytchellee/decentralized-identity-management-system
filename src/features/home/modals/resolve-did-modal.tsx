'use client';

import { BackgroundOverlay } from '@/components/background-overlay';
import styles from './index.module.scss';
import { useState } from 'react';
import { useAlgoDidActions } from '@/actions/algo-did';
import toast from 'react-hot-toast';
import { DidDocument } from '@/interface/did.interface';

interface Props {
  onClose: () => void;
}

export const ResolveDidModal = ({ onClose }: Props) => {
  const [appId, setAppId] = useState('');
  const [did, setDid] = useState('');
  const [didDoc, setDidDoc] = useState<DidDocument>();
  const { resolveDid, resolveDidByAppId, resolveDidUsingExternalApi } = useAlgoDidActions();

  const resolveDoc = async (type: 'did' | 'app-id') => {
    setDidDoc(undefined);

    try {
      toast.loading('Resolving DID...', { id: 'loader' });
      const doc =
        type === 'app-id' ? await resolveDidByAppId(appId) : await resolveDidUsingExternalApi(did);
      toast.dismiss('loader');
      toast.success('DID resolved successfully!');
      setDidDoc(doc);
    } catch (error) {
      toast.dismiss('loader');
      toast.error(`Failed to resolve DID: ${error}`);
    }
  };

  return (
    <BackgroundOverlay onClose={onClose}>
      <div className={styles.container}>
        <div className={styles.title}>
          <h4>Resolve DID</h4>
        </div>
        <div className={styles.content}>
          {!!didDoc && <textarea value={JSON.stringify(didDoc, undefined, 4)}></textarea>}
          <div className={styles.form_control}>
            <label>App ID</label>
            <input type="number" value={appId} onChange={(evt) => setAppId(evt.target.value)} />
          </div>
          <button
            onClick={() => resolveDoc('app-id')}
            disabled={!appId}
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            Resolve by App Id
          </button>
          <div className={styles.form_control}>
            <label>DID</label>
            <input type="text" value={did} onChange={(evt) => setDid(evt.target.value)} />
          </div>
          <button
            onClick={() => resolveDoc('did')}
            disabled={!did}
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            Resolve by DID
          </button>
        </div>
      </div>
    </BackgroundOverlay>
  );
};
