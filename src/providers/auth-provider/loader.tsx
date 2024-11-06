import { Spinner } from '@/components/spinner';
import styles from './index.module.scss';
import classNames from 'classnames';

export const Loader = () => {
  return (
    <div className={classNames(styles['wrapper'])}>
      <div className={styles['overlay']}></div>
      <Spinner size={40} />
    </div>
  );
};
