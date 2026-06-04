import React, { useContext } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';
import Scrollbar from '@/shared/ui/Scrollbar/Scrollbar';
import { EditorService } from '@/entities/model/EditorService';
import { EditorContext } from '../AtmEditorPage';
import s from './EquipmentTab.module.scss';

export default function EquipmentTab() {
  const { realRows, updateRows, t, isReadOnly, viewingRevIndex, rows: contextRows } = useContext(EditorContext);

  // Выделение языковых констант для текстового наполнения вкладки оборудования
  const labels = t?.equipmentPage || {};
  
  const isViewingOldRevision = viewingRevIndex !== null;
  const currentRevision = isViewingOldRevision ? contextRows?.revisions?.[viewingRevIndex] : null;

  const equipmentArray = isViewingOldRevision
    ? (currentRevision?.snapshot?.equipment || [])
    : (realRows?.equipment || []);

  // Флаг для полной блокировки интерфейса вкладки
  const shouldDisableEditing = isReadOnly || isViewingOldRevision;

  // Добавление новой пустой строки оборудования через вызов метода сервиса
  const handleAddManual = () => {
    const updatedEquipment = EditorService.addEquipmentRow(equipmentArray);
    updateRows('equipment', updatedEquipment);
  };

  // Удаление строки оборудования из массива по её индексу
  const handleRemoveRow = (idx) => {
    const updatedEquipment = equipmentArray.filter((_, i) => i !== idx);
    updateRows('equipment', updatedEquipment);
  };

  // Изменение определенного текстового поля в строке лабораторного оборудования
  const handleUpdateField = (idx, field, val) => {
    const updatedEquipment = equipmentArray.map((row, i) => 
      i === idx ? { ...row, [field]: val } : row
    );
    updateRows('equipment', updatedEquipment);
  };

  return (
    <div className={s.wrapper}>
      <div className={s.whiteCard}>
        {/* СЕКЦИЯ: ЗАГОЛОВОК СТРАНИЦЫ */}
        <h2 className={s.title}>{labels.title}</h2>

        {/* СЕКЦИЯ: ГЛАВНАЯ ТАБЛИЦА ОБОРУДОВАНИЯ */}
        <div className={s.mainTable}>
          {/* Шапка таблицы с фиксированными позициями названий колонок */}
          <div className={s.tableHeader}>
            <div className={`${s.headerLabel} ${s.labelName}`}>{labels.nameLabel}</div>
            <div className={`${s.headerLabel} ${s.labelModel}`}>{labels.modelLabel}</div>
            <div className={`${s.headerLabel} ${s.labelDate}`}>{labels.dateLabel}</div>
          </div>

          {/* Интеграция скроллбара, динамически увеличивающего высоту контента */}
          <Scrollbar className={s.scrollContainer}>
            <div className={s.tableContent}>
              <div className={s.rowsList}>
                {equipmentArray.map((row, idx) => {
                  // Жесткая фиксация ключа для предотвращения потери фокуса при вводе букв
                  const rowKey = row.id || `eq-${idx}`;

                  return (
                    <div key={rowKey} className={s.equipmentRow}>
                      <div className={s.rowContent}>
                        
                        <Input
                          className={s.nameInput}
                          placeholder={labels.namePlaceholder}
                          value={row.name || ''}
                          onChange={(e) => handleUpdateField(idx, 'name', e.target.value)}
                          readOnly={shouldDisableEditing}
                        />

                        <div className={s.separator} />

                        <Input
                          className={s.modelInput}
                          placeholder={labels.modelPlaceholder}
                          value={row.model || ''}
                          onChange={(e) => handleUpdateField(idx, 'model', e.target.value)}
                          readOnly={shouldDisableEditing}
                        />

                        <div className={s.separator} />

                        <Input
                          className={s.dateInput}
                          value={row.calDate || ''}
                          onChange={(e) => handleUpdateField(idx, 'calDate', e.target.value)}
                          readOnly={shouldDisableEditing}
                        />

                      </div>

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

        {/* СЕКЦИЯ: НИЖНЯЯ КНОПКА ПРЕДПРОСМОТРА ВСЕГО ЛИСТА ОБОРУДОВАНИЯ */}
        <div className={s.previewWrapper}>
          <Button className={s.btnPreview} variant="primary" disabled={shouldDisableEditing}>
            {labels.buttons?.preview}
          </Button>
        </div>
      </div>
    </div>
  );
}