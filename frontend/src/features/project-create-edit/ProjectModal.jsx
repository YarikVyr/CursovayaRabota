import React, { useState, useEffect } from 'react';
import BaseModal from '@/shared/ui/BaseModal/BaseModal';
import { Input } from '@/shared/ui/Input/Input';
import { CustomSelect } from '@/shared/ui/CustomSelect/CustomSelect';
import { useLang } from '@/shared/lib/context/LangContext';
import { projectTranslations, projectData } from '@/shared/config/ProjectPagetranslations';
import styles from './ProjectModal.module.scss';
import { Button } from '@/shared/ui/Button/Button';

const INITIAL_PROJECT_FORM = {
  name: '',
  typeVS: '',
  typeTrainer: '',
  typeRMI: ''
};

const duplicateMessages = {
  ru: '\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043f\u0440\u043e\u0435\u043a\u0442 \u043d\u0435 \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u0441\u044f. \u0422\u0430\u043a\u043e\u0439 \u043f\u0440\u043e\u0435\u043a\u0442 \u0443\u0436\u0435 \u0435\u0441\u0442\u044c',
  en: 'Project cannot be saved. This project already exists'
};

export default function ProjectModal({ isOpen, onClose, onSave, editingProject, duplicateError = false, onFormChange }) {
  const { lang } = useLang();
  const t = projectTranslations[lang];
  const [formData, setFormData] = useState(INITIAL_PROJECT_FORM);

  useEffect(() => {
    if (isOpen) setFormData(editingProject || INITIAL_PROJECT_FORM);
  }, [editingProject, isOpen]);

  const updateField = (field, value) => {
    onFormChange?.();
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const saved = onSave(formData);
    if (saved !== false) onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className={styles.modalForm}>
        <h2 className={styles.modalTitle}>
          {editingProject ? t.modals.editTitle : t.modals.createTitle}
        </h2>

        <div className={styles.inputsStack}>
          <div className={styles.inputFieldContainer}>
            <Input
              required
              placeholder={t.modals.namePlaceholder}
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              error={duplicateError}
            />
          </div>

          <CustomSelect
            className={styles.projectModalSelect}
            placeholder={t.modals.selectVS}
            options={projectData.aircraftTypes}
            value={formData.typeVS}
            disabled={!formData.name.trim() && !formData.typeVS}
            error={duplicateError}
            onChange={(e) => {
              onFormChange?.();
              setFormData({ ...formData, typeVS: e.target.value, typeTrainer: '', typeRMI: '' });
            }}
          />

          <CustomSelect
            placeholder={t.modals.selectTrainer}
            options={projectData.trainerTypes}
            value={formData.typeTrainer}
            disabled={!formData.typeVS && !formData.typeTrainer}
            error={duplicateError}
            onChange={(e) => {
              onFormChange?.();
              setFormData({ ...formData, typeTrainer: e.target.value, typeRMI: '' });
            }}
          />

          <CustomSelect
            placeholder={t.modals.selectRMI}
            options={projectData.rmiTypes}
            value={formData.typeRMI}
            disabled={!formData.typeTrainer && !formData.typeRMI}
            error={duplicateError}
            onChange={(e) => updateField('typeRMI', e.target.value)}
          />
        </div>

        {duplicateError && (
          <p className={styles.errorText}>{duplicateMessages[lang] || duplicateMessages.ru}</p>
        )}

        <Button type="submit" className={styles.modalSubmitBtn}>
          {editingProject ? t.actions.save : t.actions.create}
        </Button>
      </form>
    </BaseModal>
  );
}
