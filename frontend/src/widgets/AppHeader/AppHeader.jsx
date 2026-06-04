import React from 'react';
import { Search } from 'lucide-react';
import { useUser } from "@/entities/user/model/UserContext";
import { useLang } from '@/shared/lib/context/LangContext';
import { Link } from 'react-router-dom';
import { projectTranslations } from '@/shared/config/ProjectPagetranslations';
import styles from './AppHeader.module.scss';

const LANGUAGES = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' }
];

export default function AppHeader({ searchQuery, setSearchQuery }) {
  const { user, logout } = useUser();
  const { lang, setLang } = useLang();
  const t = projectTranslations[lang];

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logoLink}>
        <h1 className={styles.logo}>{t.title}</h1>
      </Link>

      <div className={styles.searchBar}>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} size={14} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.headerActions}>
        <div className={styles.langSwitcher} data-lang={lang}>
          <div className={styles.langSlider} />
          
          {LANGUAGES.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              className={lang === code ? styles.langBtnActive : styles.langBtn}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.userBadge}>
          <span className={styles.userName}>{user?.fullName || 'Guest'}</span>
        </div>

        <button onClick={logout} className={styles.logoutBtn}>
          {t.logout}
        </button>
      </div>
    </header>
  );
}