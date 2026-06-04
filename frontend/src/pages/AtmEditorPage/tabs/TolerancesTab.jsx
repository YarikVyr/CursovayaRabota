import React, { useContext } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';
import { CustomSelectTab } from '@/shared/ui/CustomSelectTab/CustomSelectTab';
import Scrollbar from '@/shared/ui/Scrollbar/Scrollbar';
import { EditorService } from '@/entities/model/EditorService';
import { EditorContext } from '../AtmEditorPage';
import s from './TolerancesTab.module.scss';

export default function TolerancesTab() {
  const { realRows, updateRows, t, isReadOnly, viewingRevIndex, rows: contextRows } = useContext(EditorContext);

  const labels = t?.tolerancesPage || {};
  
  const isViewingOldRevision = viewingRevIndex !== null;
  const currentRevision = isViewingOldRevision ? contextRows?.revisions?.[viewingRevIndex] : null;

  const tolerancesArray = isViewingOldRevision
    ? (currentRevision?.snapshot?.tolerances || [])
    : (realRows?.tolerances || []);

  const shouldDisableEditing = isReadOnly || isViewingOldRevision;

  const handleAddManual = () => {
    const updated = EditorService.addToleranceRow(tolerancesArray);
    updateRows('tolerances', updated);
  };

  const handleRemoveRow = (idx) => {
    const updated = tolerancesArray.filter((_, i) => i !== idx);
    updateRows('tolerances', updated);
  };

  const handleUpdateField = (idx, field, val) => {
    const updated = tolerancesArray.map((row, i) => 
      i === idx ? { ...row, [field]: val } : row
    );
    updateRows('tolerances', updated);
  };

  return (
    <div className={s.wrapper}>
      <div className={s.whiteCard}>
        <h2 className={s.title}>{labels.title}</h2>

        <div className={s.mainTable}>
          {/* Шапка таблицы */}
          <div className={s.tableHeader}>
            <div className={`${s.headerLabel} ${s.labelParam}`}>{labels.paramLabel}</div>
            <div className={`${s.headerLabel} ${s.labelTolerance}`}>{labels.toleranceLabel}</div>
            <div className={`${s.headerLabel} ${s.labelNominal}`}>{labels.nominalLabel}</div>
            <div className={`${s.headerLabel} ${s.labelUnit}`}>{labels.unitLabel}</div>
          </div>

          {/* Контейнер со скроллбаром */}
          <Scrollbar className={s.scrollContainer}>
            <div className={s.tableContent}>
              <div className={s.rowsList}>
                {tolerancesArray.map((row, idx) => {
                  const rowKey = row.id || `tol-${idx}`;

                  return (
                    <div key={rowKey} className={s.tolerancesRow}>
                      <div className={s.rowContent}>
                        
                        {/* Поле: Параметр */}
                        <Input
                          className={s.paramInput}
                          placeholder={labels.paramPlaceholder}
                          value={row.param || ''}
                          onChange={(e) => handleUpdateField(idx, 'param', e.target.value)}
                          readOnly={shouldDisableEditing}
                        />

                        <div className={s.separator} />

                        {/* Селект: Допуск */}
                        <CustomSelectTab
                          className={s.toleranceSelect}
                          placeholder={labels.tolerancePlaceholder}
                          value={row.tolerance}
                          options={[]}
                          onChange={(val) => handleUpdateField(idx, 'tolerance', val)}
                          disabled={shouldDisableEditing}
                        />

                        <div className={s.separator} />

                        {/* Поле: Номинал */}
                        <Input
                          className={s.nominalInput}
                          placeholder={labels.nominalPlaceholder}
                          value={row.nominal || ''}
                          onChange={(e) => handleUpdateField(idx, 'nominal', e.target.value)}
                          readOnly={shouldDisableEditing}
                        />

                        <div className={s.separator} />

                        {/* Селект: Ед. изм. */}
                        <CustomSelectTab
                          className={s.unitSelect}
                          placeholder={labels.unitPlaceholder}
                          value={row.unit}
                          options={[]}
                          onChange={(val) => handleUpdateField(idx, 'unit', val)}
                          disabled={shouldDisableEditing}
                        />

                      </div>

                      {/* Кнопка удаления строки */}
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

          {/* Подвал таблицы с кнопкой добавления */}
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