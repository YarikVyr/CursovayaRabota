import React from 'react';
import { Search, FileText } from 'lucide-react';
import s from './MainContentTab.module.scss';

const MainContentTab = ({
  t,
  activeTab
}) => {
  return (
    <div className={s.wrapper}>
      <aside className={s.librarySidebar}>
        <div className={s.sideHeader}>
          <h3 className={s.sideTitle}>{t?.lib || 'Библиотека'}</h3>
          <div className={s.searchWrapper}>
            <Search className={s.searchIcon} size={14} />
            <input
              type="text"
              placeholder={t?.search || 'Поиск...'}
              className={s.searchInput}
            />
          </div>
        </div>
        <div className={s.emptyContent}>{t?.emptyLib || 'Библиотека пуста'}</div>
      </aside>

      <main className={s.editorMain}>
        <div className={s.headerGray}>{activeTab}</div>

        <div className={s.mainEmptyState}>
          <div className={s.emptyIconWrapper}>
            <FileText size={48} className={s.largeIcon} />
            <p className={s.noElementsText}>{t?.noElements || 'Нет элементов'}</p>
          </div>
        </div>
      </main>

      <aside className={s.propsSidebar}>
        <div className={s.headerGray}>{t?.props || 'Свойства'}</div>
        <div className={s.emptyContent}>{t?.selectEl || 'Выберите элемент'}</div>
      </aside>
    </div>
  );
};

export default MainContentTab;
