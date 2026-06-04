// Основные настройки модального окна подтверждения

import React from 'react';
import BaseModal from '@/shared/ui/BaseModal/BaseModal';
import { Button } from '@/shared/ui/Button/Button';
import styles from './ConfirmModal.module.scss';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, description, confirmText, cancelText,variant = 'delete', buttons }) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} showCloseIcon={false}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        
        <div className={styles.actions}>
          {buttons && buttons.length > 0 ? (
            buttons.map((btn, idx) => (
              <Button 
                key={idx}
                onClick={btn.onClick} 
                variant={btn.variant || 'primary'}
                disabled={btn.disabled} 
                className={`${styles.confirmBtn} ${btn.className || ''}`}
              >
                {btn.text}
              </Button>
            ))
          ) : (
            <>
              <Button 
                onClick={onConfirm} 
                className={`${styles.confirmBtn} ${styles[variant]}`}
              >
                {confirmText}
              </Button>
              
              <Button 
                onClick={onClose} 
                className={styles.cancelBtn}
              >
                {cancelText}
              </Button>
            </>
          )}
        </div>
      </div>
    </BaseModal>
  );
}