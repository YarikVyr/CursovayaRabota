import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useUser } from '@/entities/user/model/UserContext'; 
import { useLang } from '@/shared/lib/context/LangContext';
import { projectTranslations } from '@/shared/config/ProjectPagetranslations';
import { projectService, ITEMS_PER_PAGE, getConfirmConfig } from '@/entities/model/projectService';

import Pagination from '@/shared/ui/Pagination/Pagination';
import CreateProjectCard from '@/shared/ui/CreateField/CreateField';
import AppHeader from '@/widgets/AppHeader/AppHeader';
import ProjectTabs from '../../features/project-filter/ui/ProjectTabs';
import ProjectCard from '@/entities/ui/ProjectCard/ProjectCard';
import ProjectModal from '@/features/project-create-edit/ProjectModal';
import TransferModal from '@/features/project-transfer/TransferModal';
import ConfirmModal from '@/shared/ui/ConfirmModal/ConfirmModal';

import styles from './ProjectPage.module.scss';

export default function ProjectPage() {
  // Получение данных пользователя и настройки языка через контексты
  const { user } = useUser();
  const { lang } = useLang();
  const t = projectTranslations[lang]; 

  // Группировка состояния для данных, поиска, вкладок и пагинации
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Состояния для управления модальными окнами и выбора объекта для редактирования
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [activeConfirm, setActiveConfirm] = useState(null); 
  
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectDuplicateError, setProjectDuplicateError] = useState(false);

  useEffect(() => {
    setProjects(projectService.getProjects());
    setAllUsers(projectService.getAllUsers()); 
  }, []);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, currentTab]);

  // Фильтрация, подсчет страниц и логика карточки создания
  const { paginatedProjects, totalPages, latestRecentProjectId } = useMemo(() => {
    const filtered = projectService.getFilteredProjects(projects, {
      tab: currentTab,
      searchQuery,
      userId: user?.id
    });

    const isMineTab = currentTab === 'mine';
    const latestRecentProject = filtered
      .filter(project => {
        const isOwner = project.authorId === user?.id || project.ownerId === user?.id;
        return isOwner && project.contentUpdatedAt > 0;
      })
      .sort((left, right) => (right.contentUpdatedAt || 0) - (left.contentUpdatedAt || 0))[0];
    const latestRecentId = latestRecentProject?.id || null;
    const orderedProjects = filtered
      .map((project, index) => ({ project, index }))
      .sort((left, right) => {
        const leftLatest = left.project.id === latestRecentId;
        const rightLatest = right.project.id === latestRecentId;

        if (leftLatest !== rightLatest) return leftLatest ? -1 : 1;
        return left.index - right.index;
      })
      .map(({ project }) => project);

    const displayItems = isMineTab
      ? [{ type: 'create', id: 'create-project-card' }, ...orderedProjects]
      : orderedProjects;
    const pagination = projectService.getPaginatedData(displayItems, currentPage, ITEMS_PER_PAGE);

    return {
      paginatedProjects: pagination.items,
      totalPages: pagination.totalPages,
      latestRecentProjectId: latestRecentId
    };
  }, [projects, searchQuery, currentTab, currentPage, user]);

  const syncData = useCallback((updatedList, options = {}) => {
    const { isContentChange = false } = options;
    
    const listToSave = isContentChange 
      ? updatedList.map(p => {
          if (p.updatedAt && Date.now() - p.updatedAt < 1000) {
            return { ...p, contentUpdatedAt: Date.now() };
          }
          return p;
        })
      : updatedList;

    setProjects(listToSave);
    projectService.saveProjects(listToSave); 
    setActiveConfirm(null);
  }, []);

  const handleSaveProject = (formData) => {
    const hasDuplicate = projectService.hasDuplicateProject(projects, formData, {
      ownerId: user?.id,
      excludeId: editingProject?.id
    });

    if (hasDuplicate) {
      setProjectDuplicateError(true);
      return false;
    }

    let updated = editingProject 
      ? projects.map(p => p.id === editingProject.id ? { ...p, ...formData, updatedAt: Date.now() } : p)
      : [projectService.createNewProject(formData, user), ...projects];
    
    syncData(updated);
    setIsProjectModalOpen(false);
    setProjectDuplicateError(false);
    return true;
  };

  const handleConfirmAction = () => {
    if (!activeConfirm) return;
    const { id, type } = activeConfirm;
    const method = type === 'delete' ? 'deleteProject' : 'restoreProject';
    syncData(projectService[method](projects, id, user?.id));
  };

  return (
    <div className={styles.pageWrapper}>
      <AppHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>
          {t?.project?.[`${currentTab}Title`] || t?.project?.pageTitle}
        </h1>
        
        <ProjectTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
        
        <div className={styles.projectsGrid}>
          {paginatedProjects.map((project) => project.type === 'create' ? (
            <CreateProjectCard
              key={project.id}
              onClick={() => { setEditingProject(null); setProjectDuplicateError(false); setIsProjectModalOpen(true); }}
            />
          ) : (
            <ProjectCard 
              key={project.id}
              project={project}
              isLatestRecent={project.id === latestRecentProjectId}
              onEdit={(p) => { setEditingProject(p); setProjectDuplicateError(false); setIsProjectModalOpen(true); }}
              onClone={(p) => syncData(projectService.cloneProject(projects, p, t.project.copySuffix, user))}
              onDelete={() => setActiveConfirm({ id: project.id, type: 'delete' })}
              onRestore={() => setActiveConfirm({ id: project.id, type: 'restore' })}
              onTransfer={(p) => { setSelectedProject(p); setIsTransferModalOpen(true); }}
            />
          ))}
        </div>

        <div className={styles.paginationContainer}>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </main>

      <ProjectModal 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleSaveProject}
        editingProject={editingProject}
        duplicateError={projectDuplicateError}
        onFormChange={() => setProjectDuplicateError(false)}
      />

      <TransferModal 
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        project={selectedProject}
        allUsers={allUsers}
        onConfirm={(id, rec, res) => syncData(projectService.transferProject(projects, id, rec, res))}
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
