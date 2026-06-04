import React from 'react';
import { useLang } from '@/shared/lib/context/LangContext';
import { projectTranslations } from '@/shared/config/ProjectPagetranslations';
import styles from './ProjectTabs.module.scss';

export default function ProjectTabs({ currentTab, setCurrentTab }) {
  const { lang } = useLang();
  const t = projectTranslations[lang];

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsSwitcher}>
        <button
          onClick={() => setCurrentTab('all')}
          className={`${styles.tab} ${currentTab === 'all' ? styles.tabActive : styles.tabDefault}`}
        >
          {t.tabs.all}
        </button>

        <div className={styles.tabSeparator} />

        <button
          onClick={() => setCurrentTab('mine')}
          className={`${styles.tab} ${currentTab === 'mine' ? styles.tabActive : styles.tabDefault}`}
        >
          {t.tabs.mine}
        </button>

        <button
          onClick={() => setCurrentTab('trash')}
          className={`${styles.tab} ${currentTab === 'trash' ? styles.tabTrashFull : styles.tabTrashEmpty}`}
        >
          {t.tabs.trash}
        </button>
      </div>
    </div>
  );
}
