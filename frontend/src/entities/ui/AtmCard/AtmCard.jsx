import React from 'react';
import { Pencil, Trash2, History } from 'lucide-react';
import { useLang } from '@/shared/lib/context/LangContext';
import { atmTranslations } from '@/shared/config/AtmPagetranslations';
import { Button } from '@/shared/ui/Button/Button';
import { useUser } from '@/entities/user/model/UserContext';
import styles from './AtmCard.module.scss';

export default function AtmCard({ atm, isLatestRecent = false, onEdit, onDelete, onRestore, onOpen, canEdit = true, isProjectOwner }) {
  const { lang } = useLang();
  const { user } = useUser();
  const t = atmTranslations[lang?.toUpperCase() || 'RU'] || atmTranslations.RU;

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp)
      .toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' })
      .replace(/\//g, '.');
  };

  const isDeletedForMe = isProjectOwner
    ? (!!atm.deletedByAuthor || atm.deleted === true)
    : (Array.isArray(atm.hiddenByUsers) && atm.hiddenByUsers.includes(user?.id));

  const showRecentBadge = !isDeletedForMe && isLatestRecent;
  const status = atm.status || 'draft';

  return (
    <div className={`${styles.card} ${isDeletedForMe ? styles.cardDeleted : styles.cardActive} ${showRecentBadge ? styles.cardRecent : ''}`}>
      <div className={styles.cardActions} onClick={(e) => e.stopPropagation()}>
        {!isDeletedForMe && (
          <>
            {/* Кнопка Редактировать доступна только Автору проекта */}
            {canEdit && (
              <button className={`${styles.actionBtn} ${styles.btnEdit}`} onClick={() => onEdit(atm)} type="button" aria-label={t.edit}>
                <Pencil />
              </button>
            )}
            <button className={`${styles.actionBtn} ${styles.btnDelete}`} onClick={() => onDelete(atm)} type="button" aria-label={t.actions.delete}>
              <Trash2 />
            </button>
          </>
        )}
      </div>

      <h3 className={styles.cardTitle}>{atm.systemName}</h3>

      <div className={styles.cardInfo}>
        <p>{atm.codeType === 'ATA' ? t.fields.ata : t.fields.fstd}: <span>{atm.codeValue}</span></p>
        <p>{t.fields.subsystem}: <span>{atm.subsystemName}</span></p>
        <div className={styles.authorLine}>
          {t.fields.author}: <span>{atm.author}</span>
        </div>
      </div>

      <div className={styles.metaContainer}>
        <div className={styles.revText}>{t.fields.rev} {atm.rev || '1'}</div>

        <div className={styles.statusLine}>
          <div className={`${styles.statusCircle} ${styles[`status_${status}`]}`} />
          <span className={styles.statusText}>
            {t.statuses[status] || status}
          </span>
        </div>

        {showRecentBadge && (
          <div className={styles.recentBadge}>
            <History className={styles.iconRecent} />
            <span>{t.recent} ({formatDate(atm.updatedAt)})</span>
          </div>
        )}
      </div>

      <div className={styles.bottomActions}>
        <Button
          className={isDeletedForMe ? styles.restoreBigBtn : styles.openBtn}
          onClick={(e) => {
            e.stopPropagation();
            if (isDeletedForMe) {
              onRestore(atm);
            } else {
              onOpen(atm);
            }
          }}
        >
          {isDeletedForMe ? t.actions.restore : canEdit ? t.edit : t.actions.view}
        </Button>
      </div>
    </div>
  );
}