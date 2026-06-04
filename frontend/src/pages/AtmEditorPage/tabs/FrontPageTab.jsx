import React, { useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { EditorContext } from '../AtmEditorPage'; 
import { EditorService } from '@/entities/model/EditorService';

import { Input } from '@/shared/ui/Input/Input'; 
import { CustomSelect } from '@/shared/ui/CustomSelect/CustomSelect';
import { Button } from '@/shared/ui/Button/Button';
import s from './FrontPageTab.module.scss';

export default function FrontPageTab() {
  const { projectId, atmId } = useParams();
  
  // Извлечение данных из контекста страницы конструктора
  const { atmData, project, updateAtmData, t, rows, viewingRevIndex, setViewingRevIndex, isReadOnly, openWordPreview } = useContext(EditorContext);

  // Создание ссылок на скрытые системные инпуты загрузки логотипов
  const customerLogoRef = useRef(null);
  const executorLogoRef = useRef(null);

  if (!t || !atmData) return null;

  const { title, sections, fields: labels, buttons } = t.frontPage;

  const handlePreview = (e) => {
    if (e) e.preventDefault();
    // openWordPreview('title'); 
  };

  const handleFieldBlur = (fieldName, value) => {
    updateAtmData({ [fieldName]: value });
  };

  // Передача файла логотипа в сервис для конвертации в Base64 и сохранения в localStorage
  const onFileChange = (e, type) => {
    const file = e.target.files?.[0];
    EditorService.handleFileUpload(file, type, projectId, atmId, atmData, updateAtmData);
    e.target.value = ''; 
  };

  // Вывод FSTD или ATA
  const dynamicCodeLabel = atmData.codeType === 'FSTD' ? 'FSTD:' : (labels.ata || 'ATA:');

  return (
    <div className={s.wrapper}>
      <div className={s.whiteCard}>
        <h2 className={s.mainTitle}>{title}</h2>
        
        {/* Скрытые инпуты для загрузки логотипов организаций */}
        <input type="file" ref={customerLogoRef} hidden accept="image/*" onChange={(e) => onFileChange(e, 'customer')} />
        <input type="file" ref={executorLogoRef} hidden accept="image/*" onChange={(e) => onFileChange(e, 'executor')} />

        {/* ОБЩИЕ СВЕДЕНИЯ ТОЛКО В РЕЖИМЕ ЧТЕНИЯ */}
        <div className={s.section}>
          <div className={s.sectionHeader}>{sections.general}</div>
          <div className={s.grid3Cols}>
            {[
              { label: labels.systemName, val: atmData.systemName },
              { label: labels.trainerType, val: project?.typeTrainer },
              { label: labels.rmiType, val: project?.typeRMI },
              { label: labels.subsystemName, val: atmData.subsystemName },
              { label: labels.aircraftType, val: project?.typeVS },
              { label: dynamicCodeLabel, val: atmData.codeValue }
            ].map((field, idx) => (
              <div className={s.fieldItem} key={idx}>
                <label>{field.label}</label>
                <Input value={field.val || ''} disabled />
              </div>
            ))}
          </div>
        </div>

        {/* ДОКМУНТ (РЕДАКТИРУЕМЫЙ) */}
        <div className={s.section}>
          <div className={s.sectionHeader}>{sections.document}</div>
          <div className={s.documentGrid}>
            <div className={s.docLeftCol}>
              <div className={s.fieldItem}>
                <label>{labels.contractName}</label>
                <Input 
                  defaultValue={atmData.contractName || ''} 
                  onBlur={(e) => handleFieldBlur('contractName', e.target.value)}
                  readOnly={isReadOnly}
                />
              </div>
              <div className={s.fieldItem}>
                <label>{labels.docNumber}</label>
                <Input 
                  defaultValue={atmData.docNumber || ''} 
                  onBlur={(e) => handleFieldBlur('docNumber', e.target.value)}
                  readOnly={isReadOnly} 
                />
              </div>
            </div>
            <div className={s.docRightCol}>
              <div className={s.fieldItem}>
                <label>{labels.revision}</label>
                <CustomSelect
                  absoluteMode
                  variant="seamless"
                  disabled={isReadOnly}
                  value={viewingRevIndex !== null ? rows.revisions[viewingRevIndex]?.rev : atmData.rev}
                  options={rows.revisions.map((r) => ({
                    id: r.rev, 
                    name: `Rev. ${r.rev}`, 
                    value: r.rev    
                  }))}
                  onChange={(e) => {
                    const val = e.target ? e.target.value : e; 
                    const targetIdx = rows.revisions.findIndex(r => r.rev === String(val));
                    if (targetIdx !== -1) setViewingRevIndex(targetIdx);
                  }}
                  className={s.revSelectBlack} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* ОРГАНИЗАЦИЯ */}
        <div className={s.section}>
          <div className={s.sectionHeader}>{sections.organization}</div>
          <div className={s.logoGrid}>
            {[
              { label: labels.customerLogo, data: atmData.customerLogo, ref: customerLogoRef },
              { label: labels.executorLogo, data: atmData.executorLogo, ref: executorLogoRef }
            ].map((logo, idx) => (
              <div className={s.logoFieldItem} key={idx}>
                <label>{logo.label}</label>
                <div className={s.uploadRow}>
                  <div className={s.logoBox}>
                    {logo.data ? <img src={logo.data} alt="" className={s.previewImg} /> : <span className={s.logoTextSpan}>{labels.logoText}</span>}
                  </div>
                  <Button 
                    variant="primary" 
                    className={s.btnUpload} 
                    onClick={() => logo.ref.current?.click()}
                    disabled={isReadOnly}
                  >
                    {buttons.upload}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Кнопка предпросмотра титульного листа */}
        <div className={s.previewWrapperInside}>
          <Button 
            variant="primary" 
            className={s.btnPreview} 
            onClick={handlePreview}
          >
            {buttons.preview}
          </Button>
        </div>
      </div>
    </div>
  );
}
