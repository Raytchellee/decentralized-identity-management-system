import styles from './index.module.scss';
import { useState, useRef, HTMLInputTypeAttribute, CSSProperties } from 'react';
import { FiMail, FiHelpCircle } from 'react-icons/fi';
import classNames from 'classnames';
import { BsEyeSlash, BsEye } from 'react-icons/bs';
import { RiErrorWarningLine } from 'react-icons/ri';

interface InputProp {
  label?: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => any;
  warning?: string;
  error?: string;
  success?: string;
  labelStyle?: CSSProperties;
  disabled?: boolean;
  className?: string;
  description?: string;
  autoComplete?: boolean;
}

export const Input = ({
  label = '',
  type = 'text',
  placeholder = '',
  value,
  onChange = () => null,
  warning = '',
  error = '',
  success = '',
  labelStyle = {},
  disabled = false,
  className,
  description = '',
  autoComplete = true,
}: InputProp) => {
  const [hidePassword, setHidePassword] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);

  const togglePassword = () => {
    setHidePassword(!hidePassword);
    inputRef?.current?.focus();
  };

  const handleChange = (val: string) => {
    onChange(val);
  };

  return (
    <div className={classNames(styles.input, className)}>
      {label.length > 0 && (
        <div className={styles.label} style={labelStyle}>
          {label}
        </div>
      )}

      <div
        className={classNames(
          styles.inputWrapper,
          error.length > 0 ? styles.error : '',
          disabled ? styles.disabled : '',
        )}
      >
        {type === 'email' && <FiMail className={styles.emailIcon} size={20} />}

        <input
          type={type === 'password' ? (hidePassword ? type : 'text') : type}
          placeholder={placeholder}
          ref={inputRef}
          value={value}
          onChange={(event) => handleChange(event.target.value)}
          disabled={disabled}
          autoComplete={autoComplete ? 'on' : 'off'}
        />

        {type === 'password' && (
          <>
            {hidePassword ? (
              <BsEye className={styles.eyeIcon} size={20} onClick={togglePassword} />
            ) : (
              <BsEyeSlash className={styles.eyeIcon} size={20} onClick={togglePassword} />
            )}
          </>
        )}

        {error.length > 0 && <RiErrorWarningLine className={styles.errorIcon} size={15} />}

        {description.length > 0 &&
          error.length === 0 &&
          success.length === 0 &&
          type !== 'password' &&
          warning.length === 0 && (
            <div className={styles.helpIconHolder}>
              <FiHelpCircle size={15} className={styles.helpIcon} />

              <div className={styles.helpDescription}>
                {description}
                <div className={styles.shoutOut}></div>
              </div>
            </div>
          )}
      </div>

      {error.length > 0 && <div className={styles.error}>{error}</div>}

      {warning.length > 0 && <div className={styles.warning}>{warning}</div>}

      {success.length > 0 && <div className={styles.success}>{success}</div>}
    </div>
  );
};
