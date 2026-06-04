import React, { useContext } from 'react';
import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';
import Scrollbar from '@/shared/ui/Scrollbar/Scrollbar';
import { X } from 'lucide-react';
import { EditorService } from '@/entities/model/EditorService';
import { EditorContext } from '../AtmEditorPage';
import s from './ApprovalTab.module.scss';

const formatRepresentativeName = (value, inputType = '') => {
  const text = String(value || '');
  if (!text.trim()) return '';
  if (inputType.startsWith('delete')) return text;

  const normalizedText = text.trimStart();
  const letters = [];
  let secondLetterIndex = -1;

  for (let index = 0; index < normalizedText.length; index += 1) {
    if (/\p{L}/u.test(normalizedText[index])) {
      letters.push(normalizedText[index].toUpperCase());

      if (letters.length === 2) {
        secondLetterIndex = index;
        break;
      }
    }
  }

  if (letters.length === 0) return '';
  if (letters.length === 1) return letters[0];

  const surname = normalizedText.slice(secondLetterIndex + 1).replace(/^[\s.]+/, '');
  const formattedSurname = surname
    ? `${surname[0].toUpperCase()}${surname.slice(1)}`
    : '';

  return `${letters[0]}.${letters[1]}.${formattedSurname ? ` ${formattedSurname}` : ' '}`;
};

export default function ApprovalTab() {
  const { realRows, updateRows, t, isReadOnly, openWordPreview } = useContext(EditorContext);
  
  const labels = t?.approvalPage || {};
  
  // Выделение массива организаций из общей структуры таблиц документа
  const rows = realRows?.approvals || [];

  // Функция для передачи измененного массива в localstorage
  const setRows = (newRows) => updateRows('approvals', newRows);

  // Добавление пустого поля компании
  const handleAddCompany = () => setRows(EditorService.addCompany(rows));
  
  // Удаление выбранной компании
  const handleRemoveCompany = (id) => setRows(EditorService.removeCompany(rows, id));
  
  // Обновление наименования компании
  const handleUpdateCompanyName = (id, val) => setRows(EditorService.updateCompanyName(rows, id, val));
  
  // Добавление пустого поля представителя внутрь организации
  const handleAddRep = (cId) => setRows(EditorService.addRepresentative(rows, cId));
  
  // Удаление представителя из организации
  const handleRemoveRep = (cId, rId) => setRows(EditorService.removeRepresentative(rows, cId, rId));
  
  // Обновление полей Должность и"ФИО
  const handleUpdateRep = (cId, rId, field, val, inputType) => {
    const nextValue = field === 'fullName' ? formatRepresentativeName(val, inputType) : val;
    setRows(EditorService.updateRepField(rows, cId, rId, field, nextValue));
  };

  return (
    <div className={s.wrapper}>
      <div className={s.whiteCard}>
        <h2 className={s.title}>{labels.title}</h2>

        <div className={`${s.mainTable} ${rows.length > 0 ? s.mainTableFilled : ''}`}>
          <div className={s.tableHeader} />

          <Scrollbar className={s.scrollContainer}>
            <div className={s.tableContent}>
              {rows.length === 0 ? (
                <div className={s.emptyWrapper}>
                  <span className={s.emptyText}>{labels.emptyList}</span>
                </div>
              ) : (
                <div className={s.companiesList}>
                  {rows.map((company) => (
                    <div key={company.id} className={s.companyBlock}>
                      <div className={s.inputGroup}>
                        <label className={s.inputLabel}>{labels.companyNameLabel}</label>
                        <div className={s.inputRow}>
                          <Input
                            className={s.companyInput}
                            placeholder={labels.companyNamePlaceholder}
                            value={company.name}
                            onChange={(e) => handleUpdateCompanyName(company.id, e.target.value)}
                            readOnly={isReadOnly}
                          />
                          <button className={s.deleteBtn} onClick={() => handleRemoveCompany(company.id)} disabled={isReadOnly}>
                            <X/>
                          </button>
                        </div>
                      </div>

                      {/* Отрисовка списка представителей организации */}
                      {company.representatives.map((rep) => (
                        <div key={rep.id} className={s.repRowContainer}>
                          {/* Ввод должности представителя */}
                          <div className={s.repFieldGroup}>
                            <label className={s.inputLabel}>{labels.roleLabel}</label>
                            <Input
                              className={s.roleInput}
                              placeholder={labels.rolePlaceholder}
                              value={rep.role}
                              onChange={(e) => handleUpdateRep(company.id, rep.id, 'role', e.target.value)}
                              readOnly={isReadOnly}
                            />
                          </div>
                          {/* Ввод ФИО представителя */}
                          <div className={s.repFieldGroup}>
                            <label className={s.inputLabel}>{labels.nameLabel}</label>
                            <div className={s.inputRow}>
                              <Input 
                                className={s.nameInput}
                                placeholder={labels.namePlaceholder?.replace('А. А.', 'А.А.').replace('A. A.', 'A.A.')}
                                value={rep.fullName}
                                onChange={(e) => handleUpdateRep(company.id, rep.id, 'fullName', e.target.value, e.nativeEvent.inputType || '')}
                                readOnly={isReadOnly}
                              />
                              {/* Удаление строки должности */}
                              <button className={s.deleteBtn} onClick={() => handleRemoveRep(company.id, rep.id)} disabled={isReadOnly}>
                                <X/>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Кнопка добавления новой должности в организацию */}
                      <Button 
                        className={s.btnAddRep} 
                        variant="primary"
                        onClick={() => handleAddRep(company.id)}
                        disabled={isReadOnly}
                      >
                        {labels.buttons?.addRepresentatives}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Scrollbar>

          {/* Кнопка добавления новой организации */}
          <div className={s.tableFooter}>
            <Button className={s.btnAdd} variant="primary" onClick={handleAddCompany} disabled={isReadOnly}>
              {labels.buttons?.addCompany}
            </Button>
          </div>
        </div>

        {/* Кнопка предпросмотра листа согласования */}
        <div className={s.previewWrapper}>
          <Button 
            className={s.btnPreview} 
            variant="primary" 
            onClick={(e) => {
              if (e) e.preventDefault();
              // openWordPreview('approval');
            }}
          >
            {labels.buttons?.preview}
          </Button>
        </div>
      </div>
    </div>
  );
}
