import { ReactNode } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';

interface BackgroundOverlayProps {
    children?: ReactNode;
    visible?: boolean;
    onClose?: () => any;
    className?: string;
}

export const BackgroundOverlay = ({
    children = <></>,
    visible = true,
    onClose = () => null,
    className,
}: BackgroundOverlayProps) => {
    return visible ? (
        <div className={classNames(styles['wrapper'], className)}>
            <div className={styles['overlay']} onClick={onClose}></div>
            {children}
        </div>
    ) : null;
};
