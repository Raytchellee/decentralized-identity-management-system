import { ImSpinner2 } from 'react-icons/im';
import styles from './index.module.scss';

interface Props {
  color?: string;
  size?: number;
}

export const Spinner = ({ color = '#FFF', size = 18 }: Props) => {
  return (
    <div className={styles.spinner}>
      <ImSpinner2 color={color} size={size} className={styles.svg} />
    </div>
  );
};
