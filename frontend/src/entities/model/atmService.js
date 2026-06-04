import { atmProjectData } from '@/shared/config/AtmPagetranslations';
import { localStorageAdapter, storageKeys } from '@/shared/lib/storage/localStorageAdapter';

export const ITEMS_PER_PAGE = 6;

const DEFAULT_STATUS = 'draft';
const TABS = {
  ALL: 'all',
  TRASH: 'trash'
};

const normalizeText = (value) => String(value || '').trim().toLowerCase();

const isSameAtmFields = (left, right) => {
  return normalizeText(left?.codeType) === normalizeText(right?.codeType)
    && normalizeText(left?.codeValue) === normalizeText(right?.codeValue)
    && normalizeText(left?.systemName) === normalizeText(right?.systemName)
    && normalizeText(left?.subsystemName) === normalizeText(right?.subsystemName);
};

export const getConfirmConfig = (t, type) => {
  const configs = {
    delete: {
      title: t.modals.deleteTitle,
      description: t.modals.deleteDesc,
      confirmText: t.actions.delete,
      variant: 'delete',
    },
    restore: {
      title: t.modals.restoreTitle,
      description: t.modals.restoreDesc,
      confirmText: t.actions.restore,
      variant: 'restore',
    }
  };

  return configs[type] || {};
};

export const atmService = {
  getStorageKey(projectId) {
    return storageKeys.atmsByProject(projectId);
  },

  getProjectById(projectId) {
    const projects = localStorageAdapter.getJson(storageKeys.projects, []);
    return projects.find(p => String(p.id) === String(projectId)) || null;
  },

  getAtms(projectId) {
    const atms = localStorageAdapter.getJson(this.getStorageKey(projectId), []);
    return Array.isArray(atms)
      ? [...atms].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
      : [];
  },

  saveAtms(projectId, atms) {
    return localStorageAdapter.setJson(this.getStorageKey(projectId), atms);
  },

  isRecent(updatedAt) {
    return !!updatedAt;
  },

  getOptionsByType(data, type) {
    return type === 'ATA' ? data.ataCodes : data.fstdCodes;
  },

  getSelectedCodeData(options, codeId) {
    if (!options || !codeId) return null;
    return options.find(item => item.id === codeId);
  },

  isFormValid(codeValue, systemName) {
    return codeValue?.trim() !== '' && systemName?.trim() !== '';
  },

  resolveNames(formData) {
    const { codeType, codeId, subsystemId } = formData;
    const options = this.getOptionsByType(atmProjectData, codeType);
    const system = options.find(item => item.id === codeId);
    const subsystemObj = system?.subsystems?.find(sub => sub.id === subsystemId);
    const [, subName] = subsystemObj?.name.split(' - ') || [];

    return {
      systemName: system ? system.systemName : (formData.systemName || '-'),
      subsystemName: subName || subsystemObj?.name || formData.subsystemName || '-',
      codeValue: system ? system.id : (formData.codeValue || '-')
    };
  },

  upsertAtm(atms, { editingAtm, formData }) {
    const resolved = this.resolveNames(formData);

    const dataToSave = { 
      ...formData, 
      ...resolved,
      author: formData.author || 'Unknown',
      updatedAt: Date.now()
    };

    if (editingAtm) {
      return atms.map(a =>
        a.id === editingAtm.id
          ? {
              ...a,
              ...dataToSave,
              rev: String(Number(a.rev || 1) + 1)
            }
          : a
      );
    }

    const newAtm = {
      ...dataToSave,
      id: `atm_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      status: DEFAULT_STATUS,
      rev: '1',
      createdAt: Date.now(),
      deletedByAuthor: false,
      hiddenByUsers: []     
    };

    return [newAtm, ...atms];
  },

  hasDuplicateAtm(atms, { editingAtm, formData }) {
    if (!Array.isArray(atms)) return false;

    const resolved = this.resolveNames(formData);
    const candidate = {
      ...formData,
      ...resolved
    };

    return atms.some(atm => {
      if (atm.deleted) return false;
      if (editingAtm && String(atm.id) === String(editingAtm.id)) return false;

      return isSameAtmFields(atm, candidate);
    });
  },

  toggleTrashStatus(atms, atmId, isDeleted, { userId, isProjectOwner }) {
    return atms.map(a => {
      if (a.id !== atmId) return a;

      if (isProjectOwner) {
        return { 
          ...a, 
          deletedByAuthor: isDeleted, 
          updatedAt: Date.now() 
        };
      }

      const currentHidden = Array.isArray(a.hiddenByUsers) ? a.hiddenByUsers : [];
      const updatedHidden = isDeleted
        ? [...new Set([...currentHidden, userId])]
        : currentHidden.filter(id => id !== userId);

      return {
        ...a,
        hiddenByUsers: updatedHidden,
        updatedAt: Date.now()
      };
    });
  },

  filterAtms(atms, searchQuery, currentTab, { userId, isProjectOwner } = {}) {
    const query = searchQuery.toLowerCase();
 
    return atms.filter(a => {
      const matchesSearch = [a.systemName, a.subsystemName, a.codeValue]
        .some(field => (field || '').toLowerCase().includes(query));

      const isDeletedByAuthor = !!a.deletedByAuthor || a.deleted === true;
      const isHiddenByMe = Array.isArray(a.hiddenByUsers) && a.hiddenByUsers.includes(userId);

      const isDeletedForMe = isProjectOwner ? isDeletedByAuthor : isHiddenByMe;

      switch (currentTab) {
        case TABS.TRASH:
          return isDeletedForMe && matchesSearch;

        case TABS.ALL:
          if (isProjectOwner) return !isDeletedByAuthor && matchesSearch;
          return !isHiddenByMe && matchesSearch;

        default: {
          const statusMatches = a.status?.toLowerCase() === currentTab.toLowerCase();
          if (isProjectOwner) return !isDeletedByAuthor && statusMatches && matchesSearch;
          return !isHiddenByMe && statusMatches && matchesSearch;
        }
      }
    });
  },

  getAtmPagination(atms, { searchQuery, currentTab, currentPage, itemsPerPage, includeCreateCard = true, userId, isProjectOwner }) {
    const filtered = this.filterAtms(atms, searchQuery, currentTab, { userId, isProjectOwner });
    const isAllTab = currentTab === TABS.ALL;
    const showCreateCard = isAllTab && includeCreateCard;
    
    const latestRecentAtm = filtered
      .filter(atm => atm.updatedAt > (atm.createdAt || 0) + 10)
      .sort((left, right) => (right.updatedAt || 0) - (left.updatedAt || 0))[0];
    const latestRecentAtmId = latestRecentAtm?.id || null;

    const orderedAtms = filtered
      .map((atm, index) => ({ atm, index }))
      .sort((left, right) => {
        const leftLatest = left.atm.id === latestRecentAtmId;
        const rightLatest = right.atm.id === latestRecentAtmId;

        if (leftLatest !== rightLatest) return leftLatest ? -1 : 1;
        return left.index - right.index;
      })
      .map(({ atm }) => atm);

    const displayItems = showCreateCard
      ? [{ type: 'create', id: 'create-atm-card' }, ...orderedAtms]
      : orderedAtms;
    const startIndex = (currentPage - 1) * itemsPerPage;

    return {
      paginatedAtms: displayItems.slice(startIndex, startIndex + itemsPerPage),
      totalPages: Math.ceil(displayItems.length / itemsPerPage) || 1,
      latestRecentAtmId
    };
  }
};
