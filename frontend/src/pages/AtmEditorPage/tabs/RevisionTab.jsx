import React, { useContext, useState } from 'react';
import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';
import Scrollbar from '@/shared/ui/Scrollbar/Scrollbar';
import { EditorService } from '@/entities/model/EditorService';
import { EditorContext } from '../AtmEditorPage';
import s from './RevisionTab.module.scss';
 
export default function RevisionTab() {
  const { realRows, setViewingRevIndex, viewingRevIndex, handleRollbackRevision, t, atmData, updateRows, openWordPreview, isReadOnly } = useContext(EditorContext);

  const labels = t?.revisionPage || {};
  
  // Выделение изолированного массива ревизий из общей структуры таблиц
  const revisionsArray = realRows?.revisions || [];
  
  // Локальное состояние для фиксации ошибок валидации текстовых полей ревизии
  const [errors, setErrors] = useState({});

  // Добавление новой ревизии АТМ 
  const handleAdd = () => {
    if (isReadOnly) return;

    // Проверка заполнения обязательных полей
    const validationErrors = EditorService.validateLastRevision(revisionsArray); 

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; 
    }

    try {
      // Инициализация процесса создания новой ревизии и генерация слепка текущих данных документов
      const updatedRevisions = EditorService.addRevision(realRows, atmData); 
      updateRows('revisions', updatedRevisions);
      
      setViewingRevIndex(null);
      setErrors({});
    } catch (error) {
      console.error('Revision creation failed', error);
    }
  };

  // Удаление последней созданной ревизии и запуск восстановления данных из слепка
  const handleRemoveLast = () => {
    if (isReadOnly || revisionsArray.length <= 1) return;
    setErrors({});
    
    // Вызов функции отката стейтов всех вкладок страницы до прошлой сохраненной версии
    handleRollbackRevision();

    // Сброс индекса просмотра на актуальное состояние
    setViewingRevIndex(null); 
  };

  // Изменение содержимого полей ревизии
  const handleUpdate = (idx, field, val) => {
    if (isReadOnly) return;

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
    // Передача обновленных данных строки в сервис для сохранения в общем массиве ревизий
    const updatedRevisions = EditorService.updateRevisionField(realRows, idx, field, val);
    updateRows('revisions', updatedRevisions);
  };

  // Переключение режима отображения конструктора при клике по строке старой ревизии
  const handleRowClick = (row, idx) => {
    if (idx === revisionsArray.length - 1) {
      setViewingRevIndex(null);
      return;
    }

    setViewingRevIndex(idx);
  };

  return (
    <div className={s.wrapper}>
      <div className={s.whiteCard}>
        <h2 className={s.title}>{labels.title}</h2>

        <div className={`${s.mainTable} ${revisionsArray.length > 1 ? s.mainTableFilled : ''}`}>
          {/* ЗАГОЛОВОК ТАБЛИЦЫ РЕГИСТРАЦИИ ИЗМЕНЕНИЙ */}
          <div className={s.tableHeader}>
            <div className={`${s.headerLabel} ${s.labelRev}`}>{labels.revLabel}</div>
            <div className={`${s.headerLabel} ${s.labelDesc}`}>{labels.descriptionLabel}</div>
            <div className={`${s.headerLabel} ${s.labelReason}`}>{labels.reasonLabel}</div>
            <div className={`${s.headerLabel} ${s.labelDate}`}>{labels.dateLabel}</div>
          </div>

          {/* ОТРИСОВКА СПИСКА РЕВИЗИЙ */}
          <Scrollbar className={s.scrollContainer}>
            <div className={s.tableContent}>
              <div className={s.rowsList}>
                {revisionsArray.map((row, idx) => {
                  const isLast = idx === revisionsArray.length - 1;
                  const isFirst = idx === 0;

                  const isViewingThis = viewingRevIndex !== null 
                    ? idx === viewingRevIndex 
                    : (isLast && !row.isLocked);

                  return (
                    <div 
                      key={row.id || idx} 
                      onClick={() => handleRowClick(row, idx)}
                      className={`${s.revisionRow} ${isViewingThis ? s.activeRevision : ''}`}
                    >
                      <div className={s.rowHoverBg} />
                      <div className={s.rowContent}>
                        {/* Отображение порядкового номера ревизии/изменения */}
                        <div className={`${s.revNumberBlock} ${isLast ? s.activeBorder : ''}`}>
                          <span className={s.revText}>{row.rev}</span>
                        </div>
                        <div className={s.separator} />
                        
                        {/* Ввод описания изменений */}
                        <Input
                          className={`${s.descInput} ${errors.desc && isLast ? s.inputError : ''}`}
                          value={row.desc || ''}
                          readOnly={isReadOnly || !isLast}
                          onChange={(e) => handleUpdate(idx, 'desc', e.target.value)}
                        />

                        <div className={s.separator} />
                        
                        {/* Ввод причины */}
                        <Input
                          className={`${s.reasonInput} ${errors.reason && isLast ? s.inputError : ''}`}
                          value={row.reason || ''}
                          placeholder={idx > 0 && isLast ? labels.reasonPlaceholder : ''}
                          readOnly={isReadOnly || !isLast || isFirst}
                          onChange={(e) => handleUpdate(idx, 'reason', e.target.value)}
                        />

                        <div className={s.separator} />
                        
                        {/* Ввод даты */}
                        <Input
                          className={`${s.dateInput} ${errors.date && isLast ? s.inputError : ''}`}
                          value={row.date || ''}
                          readOnly={isReadOnly || !isLast}
                          onChange={(e) => handleUpdate(idx, 'date', e.target.value)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Scrollbar>

          {/* КНОПКИ ДОБАВЛЕНИЯ И УДАЛЕНИЯ */}
          <div className={s.tableFooter}>
            <div className={s.footerBtns}>
              {/* Фиксация текущей ревизии и создание новой ревизии документа АТМ */}
              <Button className={s.btnAdd} variant="primary" onClick={handleAdd} disabled={isReadOnly}>
                {labels.buttons?.add}
              </Button>
              {/* Полное удаление последней версии с восстановлением данных из прошлого слепка */}
              <Button 
                className={s.btnRemove} 
                onClick={handleRemoveLast}
                disabled={isReadOnly || revisionsArray.length <= 1}
              >
                {labels.buttons?.remove}
              </Button>
            </div>
          </div>
        </div>

        {/* Кнопка предпросмотра регистрации изменений */}
        <div className={s.previewWrapper}>
          <Button 
            className={s.btnPreview} 
            variant="primary" 
            onClick={(e) => {
              if (e) e.preventDefault();
              // openWordPreview('registration');
            }}
          >
            {labels.buttons?.preview}
          </Button>
        </div>
      </div>
    </div>
  );
}
