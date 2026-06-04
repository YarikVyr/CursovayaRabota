import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Copy, History } from 'lucide-react';
import { useUser } from '@/entities/user/model/UserContext';
import { useLang } from '@/shared/lib/context/LangContext';
import { projectTranslations } from '@/shared/config/ProjectPagetranslations';
import { projectService } from '../../model/projectService';
import { Button } from '@/shared/ui/Button/Button';
import styles from './ProjectCard.module.scss';

export default function ProjectCard({ project, isLatestRecent = false, onEdit, onClone, onDelete, onRestore, onTransfer }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const { lang } = useLang();
  const t = projectTranslations[lang];

  const isOwner = project.authorId === user?.id || project.ownerId === user?.id;
  
  const isDeletedForMe = isOwner 
    ? !!project.deletedByAuthor || project.deleted === true
    : (Array.isArray(project.hiddenByUsers) && project.hiddenByUsers.includes(user?.id));

  const canDeleteForRecipient = !isOwner && Array.isArray(project.sharedWith) && project.sharedWith.some(share => share.userId === user?.id);

  const canShare = isOwner && !project.isShared;
  const stats = projectService.getProjectStats(project);
  
  const showRecentBadge = !isDeletedForMe && isLatestRecent && isOwner;

  const formatDate = (timestamp) => {
    if (!timestamp) return '';

    return new Date(timestamp)
      .toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      })
      .replace(/\//g, '.');
  };

  return (
    <div className={`${styles.card} ${!isDeletedForMe ? styles.cardActive : styles.cardDeleted} ${showRecentBadge ? styles.cardRecent : ''}`}>
      
      <div className={styles.cardActions} onClick={(e) => e.stopPropagation()}>
        {!isDeletedForMe && (
          <>
            {isOwner && (
              <>
                <button className={styles.actionBtn} onClick={() => onClone(project)} aria-label={t.actions.create}>
                  <Copy />
                </button>
                <button className={`${styles.actionBtn} ${styles.btnEdit}`} onClick={() => onEdit(project)} aria-label={t.actions.edit}>
                  <Pencil />
                </button>
              </>
            )}
            
            {(isOwner || canDeleteForRecipient) && (
              <button className={`${styles.actionBtn} ${styles.btnDelete}`} onClick={() => onDelete(project)} aria-label={t.actions.delete}>
                <Trash2 />
              </button>
            )}
          </>
        )}
      </div>

      <h3 className={styles.cardTitle}>{project.name}</h3>

      <div className={styles.cardInfo}>
        <p>{t.project.typeVS}: <span>{project.typeVS}</span></p>
        <p>{t.project.trainer}: <span>{project.typeTrainer}</span></p>
        <p>{t.project.typeRMI}: <span>{project.typeRMI}</span></p>
        <div className={styles.authorLine}>
          {t.project.owner}: <span>{project.authorName || project.ownerName}</span>
        </div>
      </div>

      <div className={styles.miniStatsContainer}>
        <div className={styles.miniStats}>
          {t.stats.atm}: <strong>{stats.total}</strong>
          <span className={styles.separator}>|</span>
          {t.stats.ready}: <strong>{stats.ready}</strong>
          <span className={styles.separator}>|</span>
          {t.stats.work}: <strong>{stats.inWork}</strong>
        </div>
      </div>

      {showRecentBadge && (
        <div className={styles.recentBadge}>
          <History className={styles.recentIcon} />
          <span>{t.project.recent} ({formatDate(project.updatedAt)})</span>
        </div>
      )}

      <div className={styles.bottomActions}>
        {isDeletedForMe ? (
          <Button
            className={styles.restoreBigBtn}
            onClick={(e) => {
              e.stopPropagation();
              onRestore(project);
            }}
          >
            {t.actions.restore}
          </Button>
        ) : isOwner ? (
          <>
            <Button
              className={styles.openBtn}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/project/${project.id}`);
              }}
            >
              {t.actions.open}
            </Button>

            {canShare && (
              <Button
                className={styles.shareBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onTransfer(project);
                }}
              >
                {t.actions.share}
              </Button>
            )}
          </>
        ) : (
          <Button
            className={styles.viewProjectBtn}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/project/${project.id}`);
            }}
          >
            {t.actions.view}
          </Button>
        )}
      </div>
    </div>
  );
}