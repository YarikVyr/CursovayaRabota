import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import AuthForm from '@/features/auth/ui/AuthForm';
import { AuthService } from '@/features/auth/model/AuthService';
import { authTranslations } from '@/shared/config/AuthPagetranslations';
import { useUser } from '@/entities/user/model/UserContext';
import { useLang } from '@/shared/lib/context/LangContext';
import styles from './AuthPage.module.scss';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login } = useUser();
  const { lang } = useLang();
  const t = authTranslations[lang] || authTranslations.ru;

  const [isLogin, setIsLogin] = useState(true);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
  });

  const clearFieldError = (fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const switchMode = () => {
    setIsLogin(prev => !prev);
    setServerError('');
    setErrors({});
  };

  const handleSubmit = async (e, isPasswordValid) => {
    e.preventDefault();
    setErrors({});
    setServerError('');

    const newErrors = {};
    if (!formData.username) newErrors.username = t.errors.emptyLogin;
    if (!formData.password) newErrors.password = t.errors.emptyPassword;
    if (!isLogin && !formData.fullName) newErrors.fullName = t.errors.emptyFullName;

    if (Object.keys(newErrors).length > 0) {
      if (isLogin) {
        setServerError(t.errors.invalidAuth);
      } else {
        setErrors(newErrors);
      }
      return;
    }

    if (!isLogin && !isPasswordValid) {
      setErrors({ password: t.errors.passwordInvalid });
      return;
    }

    try { 
      const action = isLogin ? 'login' : 'register';
      const result = await AuthService.submit(action, formData);
      login(result);
      navigate('/');
    } catch (err) {
      if (err.message === 'USER_EXISTS') setServerError(t.errors.userExists);
      else if (err.message === 'INVALID_AUTH') setServerError(t.errors.invalidAuth);
      else setServerError(t.errors.unknown);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={`${styles.authCard} ${isLogin ? styles.loginCard : styles.registerCard}`}>
        <header className={styles.cardHeader}>
          <div className={styles.logoIcon} aria-hidden="true">
            <ShieldCheck />
          </div>
          <h1 className={styles.title}> 
            {isLogin ? t.titleLogin : t.titleRegister}
          </h1>
          <p className={styles.subtitle}>{t.subtitle}</p>
        </header>

        <AuthForm
          isLogin={isLogin}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          errors={errors}
          clearFieldError={clearFieldError}
          setServerError={setServerError}
          t={t}
          serverError={serverError}
        />

        <footer className={styles.cardFooter}>
          {isLogin && (
            <button type="button" className={styles.forgotBtn}>
              {t.buttons.forgot}
            </button>
          )}

          <button className={styles.switchBtn} type="button" onClick={switchMode}>
            {isLogin ? t.buttons.switchToRegister : t.buttons.switchToLogin}
          </button>
        </footer>
      </div>
    </div>
  );
}
