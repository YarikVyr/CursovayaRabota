import React, { useContext } from 'react';
import { Button } from '@/shared/ui/Button/Button';
import { EditorContext } from '../AtmEditorPage';
import s from './DiscrepanciesTab.module.scss';

export default function DiscrepanciesTab() {
  const { t, isReadOnly } = useContext(EditorContext);
  
  const labels = t?.discrepanciesPage || {};

  return (
    <div className={s.wrapper}>
      <div className={s.whiteCard}>
        {/* ЗАГОЛОВОК СТРАНИЦЫ */}
        <h2 className={s.title}>{labels.title}</h2>

        {/* ЦЕНТРАЛЬНАЯ КНОПКА ПЕРЕХОДА С ФИКСИРОВАННЫМИ ОТСТУПАМИ */}
        <div className={s.actionWrapper}>
          <Button 
            className={s.btnConstructor} 
            variant="primary"
            disabled={isReadOnly}
          >
            {labels.buttons?.goToConstructor}
          </Button>
        </div>
      </div>
    </div>
  );
}