import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '@/entities/user/model/UserContext';
import { atmService, ITEMS_PER_PAGE, getConfirmConfig } from '@/entities/model/atmService';
import { atmTranslations } from '@/shared/config/AtmPagetranslations';
import { localStorageAdapter, storageKeys } from '@/shared/lib/storage/localStorageAdapter';
import { useLang } from '@/shared/lib/context/LangContext';

import AppHeader from '@/widgets/AppHeader/AppHeader';
import Pagination from '@/shared/ui/Pagination/Pagination';
import AtmTabs from '@/features/atm-filter/ui/AtmTabs/AtmTabs';
import AtmModal from '@/features/atm-create-edit/ui/AtmModal/AtmModal';
import ConfirmModal from '@/shared/ui/ConfirmModal/ConfirmModal';
import CreateField from '@/shared/ui/CreateField/CreateField';
import AtmCard from '@/entities/ui/AtmCard/AtmCard';

import styles from './AtmListPage.module.scss';

export default function AtmListPage({ currentRole }) {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { user } = useUser();
  const { lang } = useLang();

  const project = useMemo(() => atmService.getProjectById(projectId), [projectId]);
  const [atms, setAtms] = useState(() => atmService.getAtms(projectId));
  const [currentTab, setCurrentTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAtm, setEditingAtm] = useState(null);
  const [activeConfirm, setActiveConfirm] = useState(null);
  const [atmDuplicateError, setAtmDuplicateError] = useState(false);

  const currentLang = (lang || 'ru').toUpperCase();
  const t = atmTranslations[currentLang] || atmTranslations.RU;
  const isProjectOwner = project?.ownerId === user?.id;

  useEffect(() => {
    const syncAtms = () => projectId && setAtms(atmService.getAtms(projectId));
    syncAtms();
    window.addEventListener('focus', syncAtms);
    return () => window.removeEventListener('focus', syncAtms);
  }, [projectId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, currentTab]);

  const { paginatedAtms, totalPages, latestRecentAtmId } = useMemo(() => {
    return atmService.getAtmPagination(atms, {
      searchQuery,
      currentTab, 
      currentPage,
      itemsPerPage: ITEMS_PER_PAGE,
      includeCreateCard: isProjectOwner,
      userId: user?.id,
      isProjectOwner: isProjectOwner
    });
  }, [atms, searchQuery, currentTab, currentPage, isProjectOwner, user?.id]);

  const updateAtmsAndSave = useCallback((updatedAtms, options = {}) => {
    const { isContentChange = false } = options;
    
    setAtms(updatedAtms);
    atmService.saveAtms(projectId, updatedAtms);

    const allProjects = localStorageAdapter.getJson(storageKeys.projects, []);
    if (!allProjects.length) return;

    const updatedProjects = allProjects.map(p =>
      p.id === projectId 
        ? { 
            ...p, 
            updatedAt: Date.now(), 
            ...(isContentChange ? { contentUpdatedAt: Date.now() } : {})
          } 
        : p
    );
    localStorageAdapter.setJson(storageKeys.projects, updatedProjects);
  }, [projectId]);

  const handleOpenCreate = () => {
    setEditingAtm(null);
    setAtmDuplicateError(false);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (formDataFromModal) => {
    if (atmService.hasDuplicateAtm(atms, { editingAtm, formData: formDataFromModal })) {
      setAtmDuplicateError(true);
      return false;
    }

    const updated = atmService.upsertAtm(atms, {
      editingAtm,
      formData: formDataFromModal
    });
    updateAtmsAndSave(updated, { isContentChange: true });
    setIsModalOpen(false);
    setAtmDuplicateError(false);
    return true;
  };

  const handleConfirmAction = () => {
    if (!activeConfirm) return;

    const { id, type } = activeConfirm;
    
    const updated = atmService.toggleTrashStatus(atms, id, type === 'delete', {
      userId: user?.id,
      isProjectOwner: isProjectOwner
    });
    
    updateAtmsAndSave(updated);
    setActiveConfirm(null);
  };

  return (
    <div className={styles.pageWrapper}>
      <AppHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>
          {project?.name || 'Project'}
        </h1>

        <AtmTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />

        <div className={styles.atmsGrid}>
          {paginatedAtms.map((atm) => atm.type === 'create' ? (
            <CreateField key={atm.id} onClick={handleOpenCreate} />
          ) : (
            <AtmCard
              key={atm.id}
              atm={atm}
              isLatestRecent={atm.id === latestRecentAtmId}
              canEdit={isProjectOwner}
              isProjectOwner={isProjectOwner}
              userRole={currentRole}
              isOwner={project?.ownerId === user?.id || atm.author === user?.fullName}
              onOpen={(atmToOpen) => navigate(`/project/${projectId}/editor/${atmToOpen.id}`)}
              onEdit={(atmToEdit) => {
                setEditingAtm(atmToEdit);
                setAtmDuplicateError(false);
                setIsModalOpen(true);
              }}
              onDelete={() => setActiveConfirm({ id: atm.id, type: 'delete' })}
              onRestore={() => setActiveConfirm({ id: atm.id, type: 'restore' })}
            />
          ))}
        </div>

        <div className={styles.paginationContainer}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>

      <AtmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingAtm}
        duplicateError={atmDuplicateError}
        onFormChange={() => setAtmDuplicateError(false)}
      />

      <ConfirmModal
        isOpen={!!activeConfirm}
        onClose={() => setActiveConfirm(null)}
        onConfirm={handleConfirmAction}
        cancelText={t.actions.cancel}
        {...getConfirmConfig(t, activeConfirm?.type)}
      /> 
    </div>
  );
}
