import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './BaseModal.module.scss';

export default function BaseModal({ children, isOpen, onClose, title, showCloseIcon = true }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="presentation">
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        {showCloseIcon && (
          <button className={styles.closeBtn} onClick={onClose} type="button" aria-label="Закрыть">
            <X size={24} />
          </button>
        )}

        {title && <h2 className={styles.modalTitle}>{title}</h2>}
        {children}
      </div>
    </div>
  );
}
