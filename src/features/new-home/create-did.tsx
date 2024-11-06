'use client';

import classNames from 'classnames';
import { Button } from '@/components/buttons';
import { useState } from 'react';
import { useAuthActions } from '@/actions/auth';
import { useAlgoDidActions } from '@/actions/algo-did';
import toast from 'react-hot-toast';

interface Props {
  onSuccess: (newDid?: string) => void;
  onCancel: () => void;
}

export const CreateDiD = ({ onSuccess, onCancel }: Props) => {
  const {
    deploySmartContract,
    createDidDocument,
    startDidDocumentUpload,
    uploadDidDocument,
    finishDidDocumentUpload,
  } = useAlgoDidActions();
  const [loading, setLoading] = useState(false);
  const { disconnectWallet } = useAuthActions();

  const handleDidCreation = async () => {
    if (loading) return;

    setLoading(true);
    let appId: string;
    toast.loading('Deploying decentralized id smart contract...', { id: 'loader' });

    try {
      const response = await deploySmartContract();

      toast.success(`Smart contract deployed successfully! APP ID: ${response.appId}`);
      appId = String(response.appId);
      toast.dismiss('loader');
    } catch (error: any) {
      setLoading(false);
      toast.error(`Error deploying smart contract:, ${error.toString()}`);
      toast.dismiss('loader');
      return;
    }

    const doc = await createDidDocument({ appId: String(appId) });

    try {
      toast.loading('Preparing for document upload...', { id: 'loader' });
      await startDidDocumentUpload({ appId, document: doc });
    } catch (error) {
      console.error(error);
      toast.dismiss('loader');
      toast.error(`Failed to start document upload: ${error}`);
      setLoading(false);
      return;
    }

    try {
      toast.loading('Uploading documents...', { id: 'loader' });
      await uploadDidDocument({ document: doc, appId });
      toast.loading('Finishing upload...', { id: 'loader' });
      await finishDidDocumentUpload(appId);
      toast.dismiss('loader');
      toast.success('Your DID has been created successfully!');
      setLoading(false);
      onSuccess(doc.id);
    } catch (error) {
      console.error(error);
      toast.dismiss();
      setLoading(false);
      toast.error(`Failed to create DID: ${error}`);
    }
  };

  const handleWalletDisconnect = async () => {
    await disconnectWallet();
    onCancel();
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
        <h1 className="text-2xl font-[600] text-center">Create a new DiD</h1>
        <p className="text-base text-center text-[#8a8a8a] font-[500]">
          A decentralized ID (DID) is a digital identity that is self-owned, enabling individuals or
          entities to have control over their own digital identities without relying on a
          centralized authority. <br />
          To create a new DiD for yourself, kindly click the 'Create DiD' button below
        </p>
        <div className="flex flex-col gap-2 mt-[auto]">
          <p className="text-sm font-[500] text-slate-500">
            Have an existing DiD?{' '}
            <span onClick={() => onSuccess()} className="text-slate-900 underline cursor-pointer">
              Scan wallet for DiDs
            </span>
          </p>
          <div className="flex flex-row gap-4">
            <Button variant="outlined" onClick={handleWalletDisconnect} className="flex-1">
              Disconnect Wallet
            </Button>
            <Button loading={loading} onClick={handleDidCreation} className="flex-1">
              Create DiD
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
