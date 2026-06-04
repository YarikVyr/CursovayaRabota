import React, { useContext } from 'react';
import BaseModal from '@/shared/ui/BaseModal/BaseModal';
import { Button } from '@/shared/ui/Button/Button';
import { EditorContext } from '@/pages/AtmEditorPage/AtmEditorPage';
import { exportWordService } from '../model/exportWordService';
import styles from './ExportWordModal.module.scss';

export const ExportWordModal = ({ isOpen, onClose }) => {
  const {
    t,
    atmData,
    project,
    realRows,
    rows,
    currentRevNumber,
    viewingRevIndex
  } = useContext(EditorContext);

  if (!t) return null;

  const handleExport = (lang) => {
    const exportRows = realRows || rows;
    const exportRevNumber = viewingRevIndex !== null
      ? exportRows?.revisions?.[viewingRevIndex]?.rev
      : currentRevNumber;

    exportWordService.exportFirstThreePages({
      atmData,
      project,
      rows: exportRows,
      currentRevNumber: exportRevNumber
    }, lang);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t.exportModal?.title}</h2>
        <p className={styles.description}>{t.exportModal?.description}</p>

        <div className={styles.actions}>
          <Button className={styles.langBtn} onClick={() => handleExport('RU')}>
            {t.exportModal?.buttons?.ru}
          </Button>
          <Button className={styles.langBtn} onClick={() => handleExport('EN')}>
            {t.exportModal?.buttons?.en}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};
