// Основные настройки модального окна передачи проекта

import React, { useState, useEffect } from 'react';
import BaseModal from '@/shared/ui/BaseModal/BaseModal';
import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';  
import { useLang } from '@/shared/lib/context/LangContext';
import { projectTranslations } from '@/shared/config/ProjectPagetranslations';
import { projectService } from '@/entities/model/projectService';
import styles from './TransferModal.module.scss';

export default function TransferModal({ isOpen, onClose, onConfirm, allUsers, project }) {
  const { lang } = useLang();
  const t = projectTranslations[lang] || projectTranslations['ru'];

  const [recipientLogin, setRecipientLogin] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setRecipientLogin('');
      setReason('');
      setError(null);
    }
  }, [isOpen]);

  // Передача проекта
  const handleConfirm = () => {
    setError(null);

    // Вызываем валидацию из сервиса
    const { isValid, errorType, selectedUser } = projectService.validateTransfer(recipientLogin, allUsers);

    if (!isValid) {
      setError(errorType);
      return;
    }

    if (reason.trim()) {
      onConfirm(project.id, selectedUser, reason.trim());
      onClose(); 
    }
  };

  if (!t?.modals) return null;

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={t.modals.transferTitle}
      showCloseIcon={false}
    >
      <div className={styles.modalForm}>
        <div className={styles.inputsStack}>

          {/* Поле Логин */}
          <label className={styles.inputLabel}>{t.modals.recipientLabel}</label>
          <Input
            placeholder={t.modals.recipientPlaceholder}
            value={recipientLogin}
            onChange={(e) => {
              setRecipientLogin(e.target.value);
              setError(null); 
            }}
            className={`${styles.customInputWrapper} ${error ? 'hasError' : ''}`}
            inputClassName={styles.transferInput}
          />

          {/* Ошибка 1: Поле login обязательно */}
          {error === 'required' && (
            <span className={styles.fieldError}>{t.modals.loginRequired}</span>
          )}

          <label className={`${styles.inputLabel} ${error === 'required' ? styles.noMarginTop : ''}`}>
            {t.modals.reasonLabel}
          </label>
          <Input
            placeholder={t.modals.reasonPlaceholder}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError(null); 
            }}
            className={`${styles.customInputWrapper} ${error === 'notFound' ? 'hasError' : ''}`}
            inputClassName={styles.transferInput}
          />
        </div>

        {/* Ошибка 2: Пользователь не найден */}
        {error === 'notFound' && (
          <span className={styles.globalError}>{t.modals.userNotFound}</span>
        )}

        <div className={styles.actions} style={error === 'notFound' ? { marginTop: 0 } : {}}>
          {/* Кнопка подтверждения */}
          <Button 
            onClick={handleConfirm} 
            className={styles.confirmBtn}
          >
            {t.actions.confirm}
          </Button>
          
          {/* Кнопка отмены */}
          <Button 
            onClick={onClose} 
            className={styles.cancelBtn}
          >
            {t.actions.cancel}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}