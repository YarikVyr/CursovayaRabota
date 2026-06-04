/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, useMemo, useCallback, createContext } from 'react';
import { useParams } from 'react-router-dom';
import { translations } from './translations';
import { EditorService } from '@/entities/model/EditorService'; 
import { WordPreviewModal } from '@/features/export-word/ui/WordPreviewModal';
import { useUser } from '@/entities/user/model/UserContext';

import './styles/Layout.scss';
import { Header } from './layout/Header';

import MainContentTab from './tabs/MainContentTab';
import AbbreviationsTab from './tabs/AbbreviationsTab'; 
import DiscrepanciesTab from './tabs/DiscrepanciesTab'; 
import EquipmentTab from './tabs/EquipmentTab';
import SourcesTab from './tabs/SourcesTab';
import ApprovalTab from './tabs/ApprovalTab';
import FrontPageTab from './tabs/FrontPageTab';
import RevisionTab from './tabs/RevisionTab';
import TolerancesTab from './tabs/TolerancesTab';

// Создание контекста для сквозной раздачи данных АТМ
export const EditorContext = createContext(null);

const getEditorTabStorageKey = (projectId, atmId) => `atm_editor_active_tab_${projectId}_${atmId}`;
const getEditorRevisionStorageKey = (projectId, atmId) => `atm_editor_active_revision_${projectId}_${atmId}`;

export default function AtmEditorPage({ project: propsProject, currentRole }) {
  const { projectId, atmId } = useParams();
  const { user } = useUser();

  const [visualLang, setVisualLang] = useState('RU');
  const [activeTab, setActiveTabState] = useState(() => {
    return localStorage.getItem(getEditorTabStorageKey(projectId, atmId)) || 'title';
  });
  const [atmData, setAtmData] = useState(null);
  const [localProject, setLocalProject] = useState(null);
  
  const t = useMemo(() => translations[visualLang] || translations['RU'], [visualLang]);

  const setActiveTab = useCallback((tabKey) => {
    setActiveTabState(tabKey);
    localStorage.setItem(getEditorTabStorageKey(projectId, atmId), tabKey);
  }, [projectId, atmId]);

  useEffect(() => {
    setActiveTabState(localStorage.getItem(getEditorTabStorageKey(projectId, atmId)) || 'title');
  }, [projectId, atmId]);

  // Хранение индекса ревизии при переходе в режим просмотра
  const [viewingRevIndex, setViewingRevIndexState] = useState(() => {
    const savedIndex = localStorage.getItem(getEditorRevisionStorageKey(projectId, atmId));
    return savedIndex === null || savedIndex === 'latest' ? null : Number(savedIndex);
  });

  const setViewingRevIndex = useCallback((index) => {
    setViewingRevIndexState(index);
    localStorage.setItem(
      getEditorRevisionStorageKey(projectId, atmId),
      index === null ? 'latest' : String(index)
    );
  }, [projectId, atmId]);

  // Инициализация структуры таблиц спецификаций АТМ начальными пустыми массивами
  const [rows, setRows] = useState(() => EditorService.getInitialRows(null));

  // Управление вкладкой источников
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [newSource, setNewSource] = useState({ type: '', name: '' });
  const [previewPage, setPreviewPage] = useState(null);

  // Синхронизация данных при старте страницы или изменении параметров маршрута
  useEffect(() => {
    if (!propsProject) {
      setLocalProject(EditorService.getProject(projectId));
    } else {
      setLocalProject(propsProject);
    }

    // Извлечение всех сохраненных АТМ систем для выбранного тренажера
    const current = EditorService.getAtm(projectId, atmId);
    // Идентификация нужного документа АТМ по его id
    
    if (current) {
      setAtmData({ ...current });

      const initializedRows = EditorService.getInitialRows(current);
      setRows(initializedRows); 
    }
  }, [projectId, atmId, propsProject]);

  useEffect(() => {
    const savedIndex = localStorage.getItem(getEditorRevisionStorageKey(projectId, atmId));
    setViewingRevIndexState(savedIndex === null || savedIndex === 'latest' ? null : Number(savedIndex));
  }, [projectId, atmId]);

  const project = propsProject || localProject;
  const isProjectOwner = project?.ownerId === user?.id;

  const saveEditorRows = useCallback((nextRows) => {
    setRows(nextRows);
    EditorService.saveFullEditorData(projectId, atmId, nextRows);
  }, [projectId, atmId]);

  const updateAndSaveEditorRows = useCallback((updater) => {
    setRows(prev => {
      const nextRows = typeof updater === 'function' ? updater(prev) : updater;
      EditorService.saveFullEditorData(projectId, atmId, nextRows);
      return nextRows;
    });
  }, [projectId, atmId]);

  // Функция обновления карточки АТМ и синхронизации полей титульного листа
  const handleUpdateAtmData = useCallback((newData) => {
    if (!isProjectOwner) return;

    setAtmData(prev => ({ ...prev, ...newData })); 
    // Проверка принадлежности измененных полей к оформлению титульного листа
    const titleFields = ['contractName', 'docNumber', 'customerLogo', 'executorLogo'];
    const hasTitleFields = Object.keys(newData).some(key => titleFields.includes(key));

    if (hasTitleFields) {
      updateAndSaveEditorRows(prev => ({ ...prev, ...newData }));
      return;
    }

    EditorService.updateAtmAndProject(projectId, atmId, newData);
  }, [isProjectOwner, projectId, atmId, updateAndSaveEditorRows]);

  // Функция сохранения отдельной измененной таблицы конструктора
  const updateRows = (key, newRows) => {
    if (!isProjectOwner) return;

    updateAndSaveEditorRows(prev => {
      const updated = { ...prev, [key]: newRows };
      // Фиксация всей комплексной структуры АТМ в базе данных
      return updated;
    });
  };

  // Функция полного удаления последней ревизии АТМ и отката таблиц к прошлому архивному слепку
  const handleRollbackRevision = () => {
    if (!isProjectOwner) return;

    // Аннулирование записи о ревизии и возврат сохраненного слепка
    const result = EditorService.removeLastRevision(rows);
    if (!result) return;

    const { updatedRevisions, snapshot } = result;

    // Сборка структуры таблиц АТМ из слепка
    const newFullRows = snapshot
      ? EditorService.restoreRowsFromSnapshot(snapshot, updatedRevisions)
      : { ...rows, revisions: updatedRevisions };

    // Синхронный сброс состояния таблиц конструктора до параметров прошлой версии
    saveEditorRows(newFullRows);
    // Восстановление текстов и логотипов титульного листа из извлеченного слепка
    if (snapshot) {
      setAtmData(prev => EditorService.restoreAtmDataFromSnapshot(prev, snapshot));
    }
  };

  // Функция обновления данных редактора при фиксации новых ревизий
  const updateAllEditorData = (newFullRows, newAtmData) => {
    if (!isProjectOwner) return;

    saveEditorRows(newFullRows);
    if (newAtmData) {
      setAtmData(newAtmData);
    }
  };

  // Подмена таблиц rows слепком при просмотре старой ревизии
  const displayRows = useMemo(() => {
    return EditorService.getDisplayRows(rows, viewingRevIndex);
  }, [viewingRevIndex, rows]);

  // Подмена данных титульного листа слепком при просмотре старой ревизии
  const displayAtmData = useMemo(() => {
    return EditorService.getDisplayAtmData(atmData, rows, viewingRevIndex);
  }, [viewingRevIndex, atmData, rows]);

  // Вычисление строкового номера актуальной ревизии документа АТМ
  const currentRevNumber = useMemo(() => {
    return EditorService.getCurrentRevisionNumber(rows);
  }, [rows]);

  useEffect(() => {
    const revisionsLength = rows?.revisions?.length || 0;
    if (viewingRevIndex !== null && (viewingRevIndex < 0 || viewingRevIndex >= revisionsLength)) {
      setViewingRevIndex(null);
    }
  }, [rows, viewingRevIndex, setViewingRevIndex]);

  // Автоматическая запись номера ревизии в общие метаданные АТМ
  const shouldSyncRevision = atmData && currentRevNumber && atmData.rev !== currentRevNumber;
 
  useEffect(() => {
    if (shouldSyncRevision) {
      handleUpdateAtmData({ rev: currentRevNumber });
    }
  }, [currentRevNumber, shouldSyncRevision, handleUpdateAtmData]);

  const isReadOnly = useMemo(() => {
    return !isProjectOwner || EditorService.isEditorReadOnly(rows, viewingRevIndex);
  }, [isProjectOwner, viewingRevIndex, rows]);

  // Сборка единого объекта контекста для раздачи дочерним вкладкам
  const contextValue = {
    t,
    currentRevNumber,
    isReadOnly,
    isProjectOwner,
    viewingRevIndex,
    setViewingRevIndex,
    visualLang,
    setVisualLang,
    activeTab,
    setActiveTab,
    atmData: displayAtmData,
    project,
    updateAtmData: handleUpdateAtmData,
    currentRole,
    rows: displayRows,
    realRows: rows,
    updateRows,
    handleRollbackRevision,
    updateAllEditorData,
    openWordPreview: setPreviewPage,
    isSourceModalOpen,
    setIsSourceModalOpen,
    newSource,
    setNewSource
  };

  // Определение отрисовываемого компонента
  const renderTabContent = () => {
    switch (activeTab) {
      case 'title':          return <FrontPageTab />;
      case 'approval':       return <ApprovalTab />;
      case 'registration':   return <RevisionTab />;
      case 'labEquipment':   return <EquipmentTab />;
      case 'documentation':  return <SourcesTab />;
      case 'tolerances':     return <TolerancesTab />;
      case 'abbreviations':  return <AbbreviationsTab />;
      case 'main':           return <MainContentTab />;
      case 'discrepancies':  return <DiscrepanciesTab />;
      default:               return <MainContentTab />;
    }
  };

  // Проверка активности главной вкладки для настройки ширины рабочей области
  const isMainTab = activeTab === 'main';
  const isTitleTab = activeTab === 'title';

  return (
    <EditorContext.Provider value={contextValue}>
      <div className="atm-editor-wrapper">
        <Header /> 
        <main className={`main-content ${isMainTab ? 'main-content--full-width' : ''} ${isTitleTab ? 'main-content--title' : ''}`}>
          <div className={`content-container ${isMainTab ? 'content-container--full-width' : ''} ${isTitleTab ? 'content-container--title' : ''}`}>
            {renderTabContent()}
          </div>
        </main>
        <WordPreviewModal
          isOpen={!!previewPage}
          onClose={() => setPreviewPage(null)}
          page={previewPage}
          atmData={displayAtmData}
          rows={displayRows}
          currentRevNumber={currentRevNumber}
        />
      </div>
    </EditorContext.Provider>
  );
}
