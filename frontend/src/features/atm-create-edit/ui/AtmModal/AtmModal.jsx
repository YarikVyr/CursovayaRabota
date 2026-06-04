import React, { useState, useEffect, useMemo, useCallback } from 'react';
import BaseModal from '@/shared/ui/BaseModal/BaseModal';
import { CustomSelect } from '@/shared/ui/CustomSelect/CustomSelect';
import { Input } from '@/shared/ui/Input/Input';
import { Button } from '@/shared/ui/Button/Button';
import { useLang } from '@/shared/lib/context/LangContext';
import { atmTranslations, atmProjectData } from '@/shared/config/AtmPagetranslations';
import { atmService } from '@/entities/model/atmService';
import { useUser } from '@/entities/user/model/UserContext';
import styles from './AtmModal.module.scss';

const duplicateMessages = {
  RU: 'Создать АТМ не получится. Такой АТМ уже есть',
  EN: 'ATM cannot be saved. This ATM already exists'
};

export default function AtmModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  duplicateError = false,
  onFormChange
}) {
  const { lang } = useLang();
  const { user } = useUser();
  const currentLang = lang.toUpperCase();
  const t = atmTranslations[currentLang] || atmTranslations.RU;

  const [type, setType] = useState('ATA');
  const [codeValue, setCodeValue] = useState('');
  const [systemName, setSystemName] = useState('');
  const [subsystemValue, setSubsystemValue] = useState('none');

  const currentOptions = useMemo(
    () => atmService.getOptionsByType(atmProjectData, type),
    [type]
  );

  const selectedCodeData = useMemo(
    () => atmService.getSelectedCodeData(currentOptions, codeValue),
    [currentOptions, codeValue]
  );

  const subsystemOptions = selectedCodeData?.subsystems || [];

  const resetForm = useCallback(() => {
    setCodeValue('');
    setSystemName('');
    setSubsystemValue('none');
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      const nextType = initialData.codeType || 'ATA';
      const options = atmService.getOptionsByType(atmProjectData, nextType);
      const selectedCode = initialData.codeValue || '';
      const selectedData = atmService.getSelectedCodeData(options, selectedCode);
      const matchedSubsystem = selectedData?.subsystems?.find(sub =>
        sub.id === initialData.subsystemId ||
        sub.id === initialData.subsystemName ||
        sub.name === initialData.subsystemName ||
        sub.name.endsWith(` - ${initialData.subsystemName}`)
      );

      setType(nextType);
      setCodeValue(selectedCode);
      setSystemName(initialData.systemName || selectedData?.systemName || '');
      setSubsystemValue(matchedSubsystem?.id || 'none');
      return;
    }

    setType('ATA');
    resetForm();
  }, [initialData, isOpen, resetForm]);

  const handleCodeChange = (e) => {
    const selectedId = e.target.value;
    const selectedData = atmService.getSelectedCodeData(currentOptions, selectedId);

    if (!selectedData) return;

    onFormChange?.();
    setCodeValue(selectedId);
    setSystemName(selectedData.systemName);
    setSubsystemValue(selectedData.subsystems?.[0]?.id || 'none');
  };

  const handleTypeChange = (typeName) => {
    onFormChange?.();
    setType(typeName);
    resetForm();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!atmService.isFormValid(codeValue, systemName)) return;

    const saved = onSubmit({
      codeType: type,
      codeValue,
      codeId: codeValue,
      systemName,
      subsystemId: subsystemValue === 'none' ? '' : subsystemValue,
      subsystemName: subsystemValue === 'none' ? '-' : subsystemValue,
      author: user?.fullName || user?.name || 'Unknown',
      status: initialData?.status || 'draft',
      rev: initialData?.rev || '1'
    });

    if (saved !== false) {
      onClose();
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? t.modals.editTitle : t.modals.createTitle}
    >
      <form onSubmit={handleFormSubmit} className={styles.modalBody}>
        <div className={`${styles.typeSwitcher} ${duplicateError ? styles.fieldError : ''}`}>
          {['ATA', 'FSTD'].map((typeName) => (
            <button
              key={typeName}
              type="button"
              className={type === typeName ? styles.typeBtnActive : styles.typeBtn}
              onClick={() => handleTypeChange(typeName)}
            >
              {typeName}
            </button>
          ))}
        </div>

        <CustomSelect
          absoluteMode
          value={codeValue}
          options={currentOptions}
          onChange={handleCodeChange}
          placeholder={type === 'ATA' ? t.modals.codeAta : t.modals.codeFstd}
          className={styles.field}
          error={duplicateError}
        />

        <Input
          value={systemName}
          readOnly
          placeholder={t.modals.systemName}
          className={styles.field}
          error={duplicateError}
        />

        <CustomSelect
          value={subsystemValue}
          options={subsystemOptions}
          disabled={!codeValue || !subsystemOptions.length}
          placeholder={t.modals.subsystemName}
          onChange={(e) => {
            onFormChange?.();
            setSubsystemValue(e.target.value);
          }}
          className={styles.field}
          error={duplicateError}
        />

        <p className={styles.errorText}>
          {duplicateError ? duplicateMessages[currentLang] || duplicateMessages.RU : ''}
        </p>

        <Button type="submit" variant="primary" className={styles.submitBtn}>
          {initialData ? t.modals.save : t.modals.create}
        </Button>
      </form>
    </BaseModal>
  );
}
