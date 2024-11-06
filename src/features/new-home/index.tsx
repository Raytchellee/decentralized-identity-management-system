'use client';

import styles from './index.module.scss';
import { useEffect, useState } from 'react';
import { Welcome } from './welcome';
import { GettingDid } from './getting-did';
import { VerifyDids } from './verify-did';
import { CreateDiD } from './create-did';
import toast from 'react-hot-toast';

export const NewHome = () => {
  const [view, setView] = useState<'welcome' | 'getting-did' | 'create-did' | 'verify-did'>(
    'welcome',
  );
  const [dids, setDids] = useState<string[]>([]);
  const [newDid, setNewDid] = useState<string | null>(null);

  useEffect(() => {}, []);

  return (
    <main className={styles.container}>
      {view === 'welcome' && <Welcome onWalletConnect={() => setView('getting-did')} />}
      {view === 'getting-did' && (
        <GettingDid
          onGetDids={(dids) => {
            setDids(dids);

            if (dids.length === 0) {
              toast.error('No valid DiDs found. Please create one or connect another wallet.');
              setView('create-did');
            } else {
              setView('verify-did');
            }
          }}
        />
      )}
      {view === 'verify-did' && (
        <VerifyDids
          onCreateDid={() => setView('create-did')}
          dids={dids}
          onCancel={() => setView('welcome')}
          newDid={newDid}
        />
      )}
      {view === 'create-did' && (
        <CreateDiD
          onCancel={() => {
            setView('welcome');
          }}
          onSuccess={(newDid) => {
            if (newDid) setNewDid(newDid);
            setView('getting-did');
          }}
        />
      )}
    </main>
  );
};
