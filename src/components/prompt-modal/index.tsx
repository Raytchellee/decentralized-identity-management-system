import classNames from 'classnames';
import { BackgroundOverlay } from '../background-overlay';
import { GrClose } from 'react-icons/gr';
import { Button } from '../buttons';

interface Props {
  visible: boolean;
  onClose: () => void;
  title: string;
  description: string;
  yesButtonText: string;
  noButtonText?: string;
  yesAction: () => void;
  noAction?: () => void;
  loading?: boolean;
}

export const PromptModal = ({
  visible,
  onClose,
  title,
  description,
  yesButtonText,
  noButtonText = 'Cancel',
  loading = false,
  noAction,
  yesAction,
}: Props) => {
  return (
    <BackgroundOverlay visible={visible} onClose={onClose}>
      <div className="flex flex-col w-[544px] bg-white py-[18px] rounded-2xl gap-[33px]">
        <div
          className={classNames(
            'px-6 flex flex-row items-center justify-between pb-4',
            'border-b-[1px] border-b-[#E4E7EC]',
          )}
        >
          <div className="font-geist font-[600] text-[24px] text-[#1D2739]">{title}</div>
          <GrClose onClick={onClose} className="text-[#98A2B3] text-[18px] cursor-pointer" />
        </div>

        <div className="px-6 flex flex-col gap-[10px]">
          <div className="font-geist text-base text-[#1D2739] font-[400]">{description}</div>
        </div>

        <div
          className={classNames(
            'flex flex-row items-center justify-end px-6 gap-[10px]',
            'pt-4 border-t-[1px] border-t-[#E4E7EC]',
          )}
        >
          <Button
            size="sm"
            className="w-[80px]"
            variant="error-outlined"
            onClick={noAction || onClose}
          >
            {noButtonText}
          </Button>
          <Button
            onClick={yesAction}
            loading={loading}
            size="sm"
            className="w-[110px]"
            variant="error-solid"
          >
            {yesButtonText}
          </Button>
        </div>
      </div>
    </BackgroundOverlay>
  );
};
