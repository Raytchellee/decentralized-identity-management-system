'use client';

import classNames from 'classnames';
import { Button } from '@/components/buttons';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAlgoDidActions } from '@/actions/algo-did';
import { useAuthActions } from '@/actions/auth';
import { useRouter } from 'next/navigation';

interface Props {
  onCancel: () => void;
  onCreateDid: () => void;
  dids: string[];
  newDid: string | null;
}

export const VerifyDids = ({ onCancel, dids, onCreateDid, newDid }: Props) => {
  const { createdDidVerificationTxn } = useAlgoDidActions();
  const [selectedDid, setSelectedDid] = useState<string | null>(null);
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const { login, disconnectWallet } = useAuthActions();

  const onVerify = async () => {
    try {
      if (!selectedDid) {
        toast.error('Please select a DiD to proceed');
        return;
      }

      setLoading(true);

      const response = await createdDidVerificationTxn(selectedDid);
      const loginResponse = await login(response.authTransaction, selectedDid);

      if (loginResponse) {
        push('/profile');
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(`An error occurred: ${error}.`);
    }

    setLoading(false);
  };

  const handleWalletDisconnect = async () => {
    await disconnectWallet();
    onCancel();
  };

  const copyDidToClipboard = async (did: string) => {
    await navigator.clipboard.writeText(did);
    toast.success('DiD copied to clipboard');
  };

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
        <h1 className="text-2xl font-[600] text-center">Select the DID you want to sign in with</h1>
        {dids.map((did) => (
          <div
            className={classNames(
              'flex flex-col gap-4 p-4 border-[1px] border-[#cfcfcf] rounded-lg relative',
              did === selectedDid ? 'bg-slate-100' : '',
            )}
          >
            {newDid === did && (
              <div className="absolute top-1 right-1 text-[10px] bg-[#0b8d4c] py-[2px] px-2 rounded-md text-white">
                New
              </div>
            )}
            <p key={did} className="text-sm text-center text-[#8a8a8a] font-[500]">
              {did.slice(0, 50)}...
              {did.slice(did.length - 10, did.length)}
            </p>
            <div className="flex flex-row justify-between gap-2">
              <Button
                onClick={() => copyDidToClipboard(did)}
                variant="outlined"
                size="sm"
                className="w-[45%]"
              >
                Copy DiD
              </Button>
              <Button
                onClick={() => setSelectedDid(did === selectedDid ? null : did)}
                size="sm"
                className="w-[45%]"
              >
                {selectedDid === did ? 'Unselect' : 'Select'}
              </Button>
            </div>
          </div>
        ))}

        <div className="flex flex-col gap-2 mt-[auto]">
          <p className="text-sm font-[500] text-slate-500">
            Don't want to use these DiDs?{' '}
            <span
              className="text-slate-900 underline cursor-pointer"
              onClick={() => {
                if (loading) return;

                onCreateDid();
              }}
            >
              Create new DiD
            </span>
          </p>
          <div className="flex flex-row gap-4">
            <Button variant="outlined" onClick={handleWalletDisconnect} className="flex-1">
              Disconnect Wallet
            </Button>
            <Button loading={loading} disabled={!selectedDid} onClick={onVerify} className="flex-1">
              Verify DiD to Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
