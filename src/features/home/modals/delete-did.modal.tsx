'use client';

import { BackgroundOverlay } from '@/components/background-overlay';
import styles from './index.module.scss';
import { useState } from 'react';
import { useAlgoDidActions } from '@/actions/algo-did';
import toast from 'react-hot-toast';
import { DidMetadata } from '@/interface/did.interface';
import { AlgoDIDStatus } from '@/enums/algo-did.enum';

interface Props {
  onClose: () => void;
}

export const DeleteDidModal = ({ onClose }: Props) => {
  const [appId, setAppId] = useState('');
  const { getDidMetaData, prepareForDocumentDelete, deleteDocument } = useAlgoDidActions();

  const onDeleteDoc = async () => {
    let didMetaData: DidMetadata | undefined = undefined;

    try {
      toast.loading('Checking for document delete status...', { id: 'loader' });
      didMetaData = await getDidMetaData(appId);
      toast.dismiss('loader');
    } catch (error) {
      console.error(error);
    }

    if (!didMetaData) {
      toast.error(`Cannot delete the document because it does not exist.`);
      return;
    }

    if (didMetaData?.status === AlgoDIDStatus.UPLOADING) {
      toast.error(
        'Cannot delete the document at this time because an upload is currently in progress.',
      );
      return;
    }

    if (didMetaData?.status === AlgoDIDStatus.READY) {
      try {
        toast.loading('Preparing for document delete...', { id: 'loader' });
        await prepareForDocumentDelete(appId);
      } catch (error) {
        console.error(error);
        toast.dismiss('loader');
        toast.error(`Failed to prepare for document delete: ${error}`);
        return;
      }
    }

    try {
      toast.loading('Deleting documents...', { id: 'loader' });
      await deleteDocument(appId);
      toast.dismiss('loader');
      toast.success('Your DID has been deleted successfully!');
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error(`Failed to delete DID: ${error}`);
    }
  };

  return (
    <BackgroundOverlay onClose={onClose}>
      <div className={styles.container}>
        <div className={styles.title}>
          <h4>Delete DID</h4>
        </div>
        <div className={styles.content}>
          <div className={styles.form_control}>
            <label>App ID</label>
            <input type="number" value={appId} onChange={(evt) => setAppId(evt.target.value)} />
          </div>

          <button
            onClick={() => onDeleteDoc()}
            disabled={!appId}
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            Delete DiD
          </button>
        </div>
      </div>
    </BackgroundOverlay>
  );
};
