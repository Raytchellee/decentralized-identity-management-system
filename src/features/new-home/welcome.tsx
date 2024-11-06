'use client';

import classNames from 'classnames';
import { Button } from '@/components/buttons';
import { useWallet } from '@txnlab/use-wallet';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { ConnectWalletVisibleAtom } from '@/state';

interface Props {
  onWalletConnect: () => void;
}

export const Welcome = ({ onWalletConnect }: Props) => {
  const { activeAddress } = useWallet();
  const setWalletConnect = useSetRecoilState(ConnectWalletVisibleAtom);

  useEffect(() => {
    if (activeAddress) {
      onWalletConnect();
    }
  }, [activeAddress]);

  return (
    <div
      className={classNames(
        'flex flex-col w-[100%] h-[100%] mt-5 lg:mt-10',
        'justify-center items-center',
      )}
    >
      <div
        className={classNames(
          'flex flex-col w-[100%] max-w-[600px] bg-white',
          'gap-8 py-10 px-8 rounded-lg min-h-[400px]',
        )}
        style={{ boxShadow: '0px 12px 16px -4px #10182814' }}
      >
        <h1 className="text-2xl font-[600] text-center">Welcome</h1>
        <p className="text-base text-center text-[#8a8a8a] font-[500]">
          Welcome to Decentralized Identity Management Commission. <br />
        </p>
        <p className="text-base text-center text-[#8a8a8a] font-[500]">
          To proceed, kindly connect your algorand compatible wallet to get your existing DiDs or
          create a new one. Kindly note that only DiDs created and managed by your account are
          considered valid
        </p>
        <Button onClick={() => setWalletConnect(true)} className="mt-[auto]">
          Connect wallet to get or create your DID
        </Button>
      </div>
    </div>
  );
};
