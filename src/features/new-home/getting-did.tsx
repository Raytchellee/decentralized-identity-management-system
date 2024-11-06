'use client';

import classNames from 'classnames';
import { useWallet } from '@txnlab/use-wallet';
import { useEffect } from 'react';
import { Spinner } from '@/components/spinner';
import { getAlgodClient } from '@/utils/get-algo-client-config';
import toast from 'react-hot-toast';
import { useAlgoDidActions } from '@/actions/algo-did';

interface Props {
  onGetDids: (dids: string[]) => void;
}

export const GettingDid = ({ onGetDids }: Props) => {
  const { activeAddress } = useWallet();
  const algod = getAlgodClient();
  const { resolveDidByAppId } = useAlgoDidActions();

  const searchForAvailableDiDs = async () => {
    try {
      const accountInfo = await algod.accountInformation(activeAddress!).do();
      const createdApps: { id: number; params: any }[] = accountInfo['created-apps'];
      const dids: string[] = [];

      if (createdApps.length === 0) {
        onGetDids(dids);
      }

      for (const app of createdApps) {
        try {
          const didDoc = await resolveDidByAppId(String(app.id));
          dids.push(didDoc.id);
          console.log(didDoc);
        } catch (err) {
          console.log(err);
        }
      }

      onGetDids(dids);
    } catch (error) {
      toast.error('An error occurred while fetching your Decentralized ID');
      // onCancel();
      console.error(error);
    }
  };

  useEffect(() => {
    if (activeAddress) {
      searchForAvailableDiDs();
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
          'flex flex-col w-[100%] max-w-[600px] bg-white items-center',
          'gap-8 py-10 px-8 rounded-lg min-h-[400px] justify-center',
        )}
        style={{ boxShadow: '0px 12px 16px -4px #10182814' }}
      >
        <Spinner color="#0b8d4c" size={32} />
        <p className="font-[500] text-[#a5a5a5]" onClick={searchForAvailableDiDs}>
          Hold on while we check your account for existing DiDs...
        </p>
      </div>
    </div>
  );
};
