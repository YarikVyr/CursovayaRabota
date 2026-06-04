import React, { useContext } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';
import { CustomSelectTab } from '@/shared/ui/CustomSelectTab/CustomSelectTab';
import Scrollbar from '@/shared/ui/Scrollbar/Scrollbar';
import { EditorService } from '@/entities/model/EditorService';
import { EditorContext } from '../AtmEditorPage';
import s from './AbbreviationsTab.module.scss';

export default function AbbreviationsTab() {
  const { realRows, updateRows, t, isReadOnly, viewingRevIndex, rows: contextRows } = useContext(EditorContext);

  const labels = t?.abbreviationsPage || {};
  
  const isViewingOldRevision = viewingRevIndex !== null;
  const currentRevision = isViewingOldRevision ? contextRows?.revisions?.[viewingRevIndex] : null;

  const abbreviationsArray = isViewingOldRevision
    ? (currentRevision?.snapshot?.abbreviations || [])
    : (realRows?.abbreviations || []);

  const shouldDisableEditing = isReadOnly || isViewingOldRevision;

  const abbreviationOptions = []; 

  const handleAddManual = () => {
    const updatedAbbr = EditorService.addAbbreviationRow(abbreviationsArray);
    updateRows('abbreviations', updatedAbbr);
  };

  const handleRemoveRow = (idx) => {
    const updatedAbbr = abbreviationsArray.filter((_, i) => i !== idx);
    updateRows('abbreviations', updatedAbbr);
  };

  const handleUpdateField = (idx, field, val) => {
    const updatedAbbr = abbreviationsArray.map((row, i) => 
      i === idx ? { ...row, [field]: val } : row
    );
    updateRows('abbreviations', updatedAbbr);
  };

  return (
    <div className={s.wrapper}>
      <div className={s.whiteCard}>
        {/* ЗАГОЛОВОК СТРАНИЦЫ */}
        <h2 className={s.title}>{labels.title}</h2>

        {/* ГЛАВНАЯ ТАБЛИЦА */}
        <div className={s.mainTable}>
          {/* Шапка таблицы */}
          <div className={s.tableHeader}>
            <div className={`${s.headerLabel} ${s.labelAbbr}`}>{labels.abbrLabel}</div>
            <div className={`${s.headerLabel} ${s.labelDesc}`}>{labels.descLabel}</div>
          </div>

          {/* Контейнер со скроллбаром */}
          <Scrollbar className={s.scrollContainer}>
            <div className={s.tableContent}>
              <div className={s.rowsList}>
                {abbreviationsArray.map((row, idx) => {
                  const rowKey = row.id || `abbr-${idx}`;

                  return (
                    <div key={rowKey} className={s.abbreviationsRow}>
                      <div className={s.rowContent}>
                        
                        {/* Выпадающий список выбора сокращения (width: 280px) */}
                        <CustomSelectTab
                          className={s.abbrSelect}
                          placeholder={labels.abbrPlaceholder}
                          options={abbreviationOptions}
                          value={row.abbr || ''}
                          onChange={(val) => handleUpdateField(idx, 'abbr', val)}
                          disabled={shouldDisableEditing}
                        />

                        <div className={s.separator} />

                        {/* Поле ввода расшифровки (width: 892px) */}
                        <Input
                          className={s.descInput}
                          placeholder={labels.descPlaceholder}
                          value={row.desc || ''}
                          onChange={(e) => handleUpdateField(idx, 'desc', e.target.value)}
                          readOnly={shouldDisableEditing}
                        />

                      </div>

                      {/* Кнопка крестика удаления (всегда активна, отступ 10px) */}
                      <button 
                        type="button" 
                        className={s.deleteBtn} 
                        onClick={() => handleRemoveRow(idx)}
                        disabled={shouldDisableEditing}
                      >
                        <X />
                      </button>

                    </div>
                  );
                })}
              </div>
            </div>
          </Scrollbar>

          {/* Подвал таблицы с одной кнопкой добавления по центру */}
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

        {/* Кнопка предпросмотра в самом низу страницы */}
        <div className={s.previewWrapper}>
          <Button 
            className={s.btnPreview} 
            variant="primary" 
            disabled={shouldDisableEditing}
          >
            {labels.buttons?.preview}
          </Button>
        </div>
      </div>
    </div>
  );
}