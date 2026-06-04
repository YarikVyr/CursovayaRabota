import React, { useContext, useState } from 'react';
import { EditorContext } from '@/pages/AtmEditorPage/AtmEditorPage';
import ConfirmModal from '@/shared/ui/ConfirmModal/ConfirmModal';

export const ExportWordModal = ({ isOpen, onClose }) => {
  const { t } = useContext(EditorContext);
  const [isExporting, setIsExporting] = useState(false);

  if (!t) return null;

  const exportButtonsConfig = [
    {
      text: t.exportModal?.buttons?.ru,
      variant: 'primary',
      disabled: isExporting,
      onClick: (e) => { 
        e.preventDefault(); 
        setIsExporting(true);
        // Будущий вызов сервиса генерации
      }
    },
    {
      text: t.exportModal?.buttons?.en,
      variant: 'primary',
      disabled: isExporting,
      onClick: (e) => { 
        e.preventDefault();
        setIsExporting(true);
        // Будущий вызов сервиса генерации
      }
    }
  ];

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      title={t.exportModal?.title}
      description={t.exportModal?.description}
      showCloseIcon={true} 
      buttons={exportButtonsConfig} 
    />
  );
};