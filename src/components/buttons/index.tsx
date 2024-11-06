import styles from './index.module.scss';
import classNames from 'classnames';
import { ImSpinner8 } from 'react-icons/im';

enum SIZE {
  large = 'l',
  medium = 'md',
  small = 'sm',
  xtra_small = 'xs',
}

enum VARIANT {
  solid = 'solid',
  outlined = 'outlined',
  errorSolid = 'error-solid',
  errorOutlined = 'error-outlined',
  text = 'text',
}

export interface ButtonProps {
  children: any;
  size?: 'l' | 'md' | 'sm' | 'xs';
  variant?: 'solid' | 'outlined' | 'text' | 'error-solid' | 'error-outlined';
  width?: string;
  height?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
  error?: boolean;
  errorMessage?: string;
  loaderText?: string;
  title?: string;
  id?: string;
}

export function Button({
  children,
  size,
  width,
  height,
  variant,
  onClick,
  className,
  disabled = false,
  loading = false,
  error = false,
  errorMessage = 'There was an error, please try again.',
  loaderText = '',
  title,
  id,
}: ButtonProps) {
  function parseStyles() {
    const classes = [];
    let loaderSize = '18px';
    switch (size) {
      case SIZE.large:
        classes.push(styles['large']);
        loaderSize = '20px';
        break;
      case SIZE.medium:
        classes.push(styles['medium']);
        loaderSize = '18px';
        break;
      case SIZE.small:
        classes.push(styles['small']);
        loaderSize = '16px';
        break;
      case SIZE.xtra_small:
        classes.push(styles['xtra-small']);
        loaderSize = '14px';
        break;
      default:
        classes.push(styles['medium']);
        break;
    }

    switch (variant) {
      case VARIANT.solid:
        classes.push(styles['solid']);
        break;
      case VARIANT.outlined:
        classes.push(styles['outlined']);
        break;
      case VARIANT.text:
        classes.push(styles['text']);
        break;
      case VARIANT.errorSolid:
        classes.push(styles['solid-error']);
        break;
      case VARIANT.errorOutlined:
        classes.push(styles['outlined-error']);
        break;
      default:
        classes.push(styles['solid']);
        break;
    }

    if (className) {
      classes.push(className);
    }

    return { classes, loaderSize };
  }

  return (
    <>
      <button
        disabled={disabled}
        onClick={disabled || loading ? undefined : onClick}
        className={classNames(styles['wrapper'], parseStyles().classes)}
        style={{ width, height }}
        title={title}
        id={id}
      >
        {!loading && children}

        {loading && (
          <div className={styles['loader']}>
            {loaderText.length > 0 && <span className={styles['loader-text']}>{loaderText}</span>}
            <ImSpinner8 size={parseStyles().loaderSize} />
          </div>
        )}
      </button>
      {error && <div className={styles.error}>{errorMessage}</div>}
    </>
  );
}
