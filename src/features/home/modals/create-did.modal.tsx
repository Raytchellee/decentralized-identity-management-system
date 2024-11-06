'use client';

import { BackgroundOverlay } from '@/components/background-overlay';
import styles from './index.module.scss';
import { useId, useState } from 'react';
import { useAlgoDidActions } from '@/actions/algo-did';
import toast from 'react-hot-toast';
import { DidMetadata } from '@/interface/did.interface';
import { AlgoDIDStatus } from '@/enums/algo-did.enum';

interface Props {
  onClose: () => void;
}

export const CreateDidModal = ({ onClose }: Props) => {
  const [appId, setAppId] = useState('');
  const {
    deploySmartContract,
    createDidDocument,
    startDidDocumentUpload,
    getDidMetaData,
    uploadDidDocument,
    finishDidDocumentUpload,
  } = useAlgoDidActions();

  const onCreateDoc = async () => {
    let didMetaData: DidMetadata | undefined = undefined;

    try {
      toast.loading('Checking for document upload status...', { id: 'loader' });
      didMetaData = await getDidMetaData(appId);
      toast.dismiss('loader');
    } catch (error) {
      console.error(error);
    }

    const doc = await createDidDocument({ appId });

    if (!didMetaData) {
      try {
        toast.loading('Preparing for document upload...', { id: 'loader' });
        await startDidDocumentUpload({ appId, document: doc });
      } catch (error) {
        console.error(error);
        toast.dismiss('loader');
        toast.error(`Failed to start document upload: ${error}`);
        return;
      }
    }

    if (didMetaData?.status === AlgoDIDStatus.DELETING) {
      toast.dismiss('loader');
      toast.error(
        'Cannot upload document at this time because it is currently undergoing a delete operation.',
      );
      return;
    }

    try {
      toast.loading('Uploading documents...', { id: 'loader' });
      await uploadDidDocument({ document: doc, appId });
      toast.loading('Finishing upload...', { id: 'loader' });
      await finishDidDocumentUpload(appId);
      toast.dismiss('loader');
      toast.success('Your DID has been uploaded successfully! Your identifier is ' + doc.id);
      console.log(doc);
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error(`Failed to create DID: ${error}`);
    }
  };

  return (
    <BackgroundOverlay onClose={onClose}>
      <div className={styles.container}>
        <div className={styles.title}>
          <h4>Create a DID</h4>
        </div>
        <div className={styles.content}>
          <div className={styles.form_control}>
            <label>App ID</label>
            <input type="number" value={appId} onChange={(evt) => setAppId(evt.target.value)} />
          </div>

          <button
            onClick={() => onCreateDoc()}
            disabled={!appId}
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            Create DiD
          </button>
        </div>
      </div>
    </BackgroundOverlay>
  );
};
