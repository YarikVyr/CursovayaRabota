import React, { useContext } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';
import Scrollbar from '@/shared/ui/Scrollbar/Scrollbar';
import { EditorService } from '@/entities/model/EditorService';
import { EditorContext } from '../AtmEditorPage';
import s from './SourcesTab.module.scss';

export default function SourcesTab() {
  const { realRows, updateRows, t, isReadOnly, viewingRevIndex, rows: contextRows } = useContext(EditorContext);

  const labels = t?.documentsPage || {};
  
  const isViewingOldRevision = viewingRevIndex !== null;
  const currentRevision = isViewingOldRevision ? contextRows?.revisions?.[viewingRevIndex] : null;

  const sourcesArray = isViewingOldRevision
    ? (currentRevision?.snapshot?.sources || [])
    : (realRows?.sources || []);

  const shouldDisableEditing = isReadOnly || isViewingOldRevision;

  // Добавление новой пустой строки документа через вызов метода сервиса
  const handleAddManual = () => {
    const updatedSources = EditorService.addSourceRow(sourcesArray);
    updateRows('sources', updatedSources);
  };

  // Удаление строки документа из массива по её индексу
  const handleRemoveRow = (idx) => {
    const updatedSources = sourcesArray.filter((_, i) => i !== idx);
    updateRows('sources', updatedSources);
  };

  // Изменение определенного текстового поля в строке источников
  const handleUpdateField = (idx, field, val) => {
    const updatedSources = sourcesArray.map((row, i) => 
      i === idx ? { ...row, [field]: val } : row
    );
    updateRows('sources', updatedSources);
  };

  return (
    <div className={s.wrapper}>
      <div className={s.whiteCard}>
        {/* СЕКЦИЯ: ЗАГОЛОВОК СТРАНИЦЫ */}
        <h2 className={s.title}>{labels.title}</h2>

        {/* СЕКЦИЯ: ГЛАВНАЯ ТАБЛИЦА ИСТОЧНИКОВ */}
        <div className={s.mainTable}>
          {/* Шапка таблицы с фиксированными позициями названий колонок */}
          <div className={s.tableHeader}>
            <div className={`${s.headerLabel} ${s.labelNumber}`}>{labels.numberLabel}</div>
            <div className={`${s.headerLabel} ${s.labelRev}`}>{labels.revLabel}</div>
            <div className={`${s.headerLabel} ${s.labelName}`}>{labels.nameLabel}</div>
          </div>

          {/* Интеграция скроллбара, динамически увеличивающего высоту контента */}
          <Scrollbar className={s.scrollContainer}>
            <div className={s.tableContent}>
              <div className={s.rowsList}>
                {sourcesArray.map((row, idx) => {
                  // Жесткая фиксация ключа для предотвращения потери фокуса при вводе букв
                  const rowKey = row.id || `src-${idx}`;

                  return (
                    <div key={rowKey} className={s.sourcesRow}>
                      <div className={s.rowContent}>
                        
                        {/* Поле ввода номера документа */}
                        <Input
                          className={s.numberInput}
                          placeholder={labels.numberPlaceholder}
                          value={row.docNumber || ''}
                          onChange={(e) => handleUpdateField(idx, 'docNumber', e.target.value)}
                          readOnly={shouldDisableEditing}
                        />

                        <div className={s.separator} />

                        {/* Поле ввода ревизии (Rev.) */}
                        <Input
                          className={s.revInput}
                          placeholder={labels.revPlaceholder}
                          value={row.rev || ''}
                          onChange={(e) => handleUpdateField(idx, 'rev', e.target.value)}
                          readOnly={shouldDisableEditing}
                        />

                        <div className={s.separator} />

                        {/* Поле ввода названия документа */}
                        <Input
                          className={s.nameInput}
                          placeholder={labels.namePlaceholder}
                          value={row.docName || ''}
                          onChange={(e) => handleUpdateField(idx, 'docName', e.target.value)}
                          readOnly={shouldDisableEditing}
                        />

                      </div>

                      {/* Кнопка мгновенного удаления текущей строки документа */}
                      <button 
                        type="button" 
                        className={s.deleteBtn} 
                        onClick={() => handleRemoveRow(idx)}
                        disabled={shouldDisableEditing}
                      >
                        <X/>
                      </button>

                    </div>
                  );
                })}
              </div>
            </div>
          </Scrollbar>

          {/* СЕКЦИЯ: НИЖНЯЯ ПАНЕЛЬ С КНОПКОЙ ДОБАВЛЕНИЯ */}
          <div className={s.tableFooter}>
            <Button 
              className={s.btnAdd} 
              variant="primary" 
              onClick={handleAddManual}
              disabled={shouldDisableEditing}
            > 
              {labels.buttons?.add}
            </Button>
          </div>
        </div>

        {/* СЕКЦИЯ: НИЖНЯЯ КНОПКА ПРЕДПРОСМОТРА ВСЕГО ЛИСТА ИСТОЧНИКОВ */}
        <div className={s.previewWrapper}>
          <Button className={s.btnPreview} variant="primary" disabled={shouldDisableEditing}>
            {labels.buttons?.preview}
          </Button>
        </div>
      </div>
    </div>
  );
}