import React from 'react';
import { User, Lock, IdCard } from 'lucide-react';
import { Input } from '@/shared/ui/Input/Input';
import { Button } from '@/shared/ui/Button/Button';
import s from './AuthForm.module.scss';

export default function AuthForm({
  isLogin,
  formData,
  setFormData,
  onSubmit,
  t,
  serverError,
  errors,
  clearFieldError,
  setServerError
}) {
  const isPasswordValid = formData.password.length >= 8 && /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password);
  const passwordErrorText = !isLogin && formData.password.length > 0 && !isPasswordValid
    ? t.errors.password
    : errors?.password;

  const updateField = (fieldName) => (e) => {
    setFormData({ ...formData, [fieldName]: e.target.value });
    clearFieldError(fieldName);
    if (serverError) setServerError('');
  };

  return (
    <form onSubmit={(e) => onSubmit(e, isPasswordValid)} className={s.form} noValidate>
      {!isLogin && (
        <div className={s.fieldWrapper}>
          <Input
            icon={IdCard}
            placeholder={t.placeholders.name}
            value={formData.fullName}
            error={!!errors.fullName}
            onChange={updateField('fullName')}
          />
          {errors.fullName && <p className={s.errorMessage}>{errors.fullName}</p>}
        </div>
      )}

      <div className={s.fieldWrapper}>
        <Input
          icon={User}
          placeholder={t.placeholders.login}
          value={formData.username}
          error={!!serverError || !!errors.username}
          onChange={updateField('username')}
        />
        {!isLogin && errors.username && <p className={s.errorMessage}>{errors.username}</p>}
      </div>

      <div className={s.passwordGroup}>
        <Input
          icon={Lock}
          type="password"
          placeholder={isLogin ? t.placeholders.pass : t.placeholders.newPass}
          value={formData.password}
          error={!!serverError || !!passwordErrorText}
          onChange={updateField('password')}
        />
        {!isLogin && passwordErrorText && <p className={s.errorMessage}>{passwordErrorText}</p>}
      </div>

      {serverError && (
        <p className={`${s.errorMessage} ${s.centered}`}>
          {serverError}
        </p>
      )}

      <div className={s.buttonWrapper}>
        <Button type="submit" variant="primary">
          {isLogin ? t.buttons.login : t.buttons.register}
        </Button>
      </div>
    </form>
  );
}
