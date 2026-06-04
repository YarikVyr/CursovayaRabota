import React, { useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import { exportWordService } from '../model/exportWordService';
import styles from './WordPreviewModal.module.scss';

export function WordPreviewModal({
  isOpen,
  onClose,
  page,
  atmData,
  rows,
  currentRevNumber
}) {
  const previewHtml = useMemo(() => {
    if (!isOpen || !atmData) return '';

    return exportWordService.getPreviewHtml({
      atmData,
      rows,
      currentRevNumber
    }, page);
  }, [isOpen, page, atmData, rows, currentRevNumber]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') onClose();
    };

    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <button className={styles.closeBtn} type="button" onClick={onClose} aria-label="Закрыть">
          <X />
        </button>

        <div className={styles.sheetViewport}>
          <div
            className={styles.sheetScale}
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>
      </div>
    </div>
  );
}
