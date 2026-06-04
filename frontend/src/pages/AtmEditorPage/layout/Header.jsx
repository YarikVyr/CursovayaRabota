import React, { useState, useRef, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { EditorContext } from '../AtmEditorPage';
import { ExportWordModal } from '@/features/export-word/ui/ExportWordModal';
import s from './Header.module.scss';

const TAB_PAGES = [
  ['title', 'approval', 'registration', 'labEquipment', 'documentation'],
  ['documentation', 'tolerances', 'abbreviations', 'main', 'discrepancies']
];

export const Header = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const statusRef = useRef(null);

  // Потребляем контекст
  const { 
    t, 
    visualLang, 
    setVisualLang, 
    activeTab, 
    setActiveTab, 
    atmData, 
    updateAtmData,
    currentRevNumber,
    isReadOnly
  } = useContext(EditorContext);

  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [tabPage, setTabPage] = useState(0);

  // Конфиг табов выносим в константу (можно вынести в EditorService, если они меняются)
  const LANGS = {
    RU: 'RU',
    EN: 'EN'
  };

  const handleStatusChange = (newStatus) => {
    if (isReadOnly) return;

    updateAtmData({ status: newStatus });
    setIsStatusOpen(false);
  };

  // Закрытие по клику вне области
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setIsStatusOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Обновление времени автосохранения
  if (!t) return null;

  const currentStatusLabel = t.statuses?.[atmData?.status] || t.statuses?.draft;
  const visibleTabs = TAB_PAGES[tabPage];

  return (
    <header className={s.header}>
      {/* ВЕРХНЯЯ ПАНЕЛЬ: Навигация и Информация */}
      <div className={s.topBar}>
        <div className={s.left}>
          <button 
            className={s.backBtn} 
            onClick={() => navigate(`/project/${projectId}`)}
          >
            {t.back}
          </button>
          
          <div className={s.projectInfo}>
            <span className={s.systemName}>
              {atmData?.systemName} 
              {atmData?.codeValue && ` (${atmData?.codeType} ${atmData?.codeValue})`}
            </span>
            <span className={s.arrowSeparator}>&gt;</span>
            <span className={s.revision}>Rev. {currentRevNumber}</span> 
          </div>
        </div>

        <div className={s.right}>
          <div className={s.autoSave}>
            <div className={s.dot} />
            <span className={s.saveText}>{t.autoSaveLabel} 00:05:00</span>
          </div>
        </div>
      </div>

      {/* ОСНОВНАЯ ПАНЕЛЬ: Табы и Действия */}
      <div className={s.mainBar}>
        <div className={s.tabsArea}>
          <div className={`${s.tabsWrapper} ${tabPage === 1 ? s.tabsWrapperCompact : ''}`}>
            <button className={s.arrowBtn} onClick={() => setTabPage(0)}>
              <ChevronLeft className={s.icon} />
            </button>
          
          <nav className={s.tabsList}>
            {visibleTabs.map((key, index) => (
              <React.Fragment key={key}>
                <div className={s.tabItemContainer} onClick={() => setActiveTab(key)}> 
                  <button 
                    type="button"
                    className={`${s.tabItem} ${activeTab === key ? s.activeTab : ''}`}
                  >
                    {t.tabs?.[key]}
                  </button>
                </div>
                {index < visibleTabs.length - 1 && <div className={s.divider} />}
              </React.Fragment>
            ))}
          </nav>

            <button className={s.arrowBtn} onClick={() => setTabPage(1)}>
              <ChevronRight className={s.icon} />
            </button>
          </div>
        </div>

        <div className={s.actions}>
          {/* Статус-селект */}
          <div className={`${s.statusBlock} ${isReadOnly ? s.statusBlockReadOnly : ''}`}>
            <span className={s.statusLabel}>{t.atmStatus}</span>
            <div className={s.customSelect} ref={statusRef}>
              <div 
                className={`${s.selectTrigger} ${isStatusOpen ? s.triggerOpen : ''} ${isReadOnly ? s.selectTriggerDisabled : ''}`} 
                onClick={() => {
                  if (!isReadOnly) {
                    setIsStatusOpen(!isStatusOpen);
                  }
                }}
              >
                <span className={s.currentStatus}>{currentStatusLabel}</span>
                <ChevronDown className={`${s.selectIcon} ${isStatusOpen ? s.iconRotate : ''}`} />
              </div>

              {isStatusOpen && !isReadOnly && (
                <div className={s.optionsList}>
                  {Object.entries(t.statuses || {})
                    .filter(([key]) => key !== atmData?.status)
                    .map(([key, label]) => (
                      <div 
                        key={key} 
                        className={s.optionItem} 
                        onClick={() => handleStatusChange(key)}
                      >
                        {label}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <button className={s.saveBtn} disabled={isReadOnly}>{t.save}</button>
          <button className={s.exportBtn} onClick={() => setIsExportModalOpen(true)}>
            {t.export}
          </button>

          {/* Переключатель языков */}
          <div className={s.langSwitcher} data-lang={visualLang.toLowerCase()}>
            {Object.values(LANGS).map((l) => (
              <button 
                key={l}
                className={`${s.langBtn} ${visualLang === l ? s.activeText : ''}`} 
                onClick={() => setVisualLang(l)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ExportWordModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </header>
  );
};
