import React, { useMemo } from 'react';
import { useLang } from '@/shared/lib/context/LangContext';
import { atmTranslations } from '@/shared/config/AtmPagetranslations';
import styles from './AtmTabs.module.scss';

const TAB_TYPES = ['all', 'draft', 'process', 'review', 'ready', 'trash'];

export default function AtmTabs({ currentTab, setCurrentTab }) {
  const { lang } = useLang();
  const currentLang = (lang || 'ru').toUpperCase();
  const t = atmTranslations[currentLang] || atmTranslations.RU;

  const tabs = useMemo(() => {
    return TAB_TYPES.map(id => ({
      id,
      label: t.tabs[id]
    }));
  }, [t]);

  return (
    <div className={styles.tabsSection}>
      <div className={styles.tabsContainer}>
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCurrentTab(tab.id)}
              className={`
                ${styles.tabBtn}
                ${styles[tab.id]}
                ${isActive ? styles.tabActive : styles.tabDefault}
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
