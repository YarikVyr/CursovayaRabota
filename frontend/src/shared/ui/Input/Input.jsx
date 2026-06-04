import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import s from './Input.module.scss';

export const Input = ({
  icon: Icon,
  error,
  errorText,
  className,
  inputClassName,
  type,
  value,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordType = type === 'password';
  const currentInputType = isPasswordType && isPasswordVisible ? 'text' : type;

  return (
    <div className={`${s.inputWrapper} ${className || ''}`}>
      {Icon && <span className={s.icon}><Icon /></span>}

      <input
        {...props}
        type={currentInputType}
        value={value}
        className={`
          ${s.inputField}
          ${inputClassName || ''}
          ${error ? s.inputError : ''}
          ${isPasswordType ? s.withPaddingRight : ''}
          ${Icon ? s.withIcon : ''}
        `}
      />

      {isPasswordType && value?.length > 0 && (
        <button
          type="button"
          className={s.eyeButton}
          onClick={() => setIsPasswordVisible(prev => !prev)}
          tabIndex="-1"
          aria-label={isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
        >
          {isPasswordVisible ? <EyeOff /> : <Eye />}
        </button>
      )}

      {error && errorText && <p className={s.errorText}>{errorText}</p>}
    </div>
  );
};
