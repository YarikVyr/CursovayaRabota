import { localStorageAdapter, storageKeys } from '@/shared/lib/storage/localStorageAdapter';

export const ITEMS_PER_PAGE = 6;

const normalizeUser = (user) => ({
  ...user,
  login: user.login || user.username,
  username: user.username || user.login,
  fullName: user.fullName || user.name || user.login || user.username
});

const normalizeText = (value) => String(value || '').trim().toLowerCase();

const isSameProjectFields = (left, right) => {
  return normalizeText(left?.name) === normalizeText(right?.name)
    && normalizeText(left?.typeVS) === normalizeText(right?.typeVS)
    && normalizeText(left?.typeTrainer) === normalizeText(right?.typeTrainer)
    && normalizeText(left?.typeRMI) === normalizeText(right?.typeRMI); 
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

export const projectService = {
  getProjects() {
    const projects = localStorageAdapter.getJson(storageKeys.projects, []);
    return Array.isArray(projects) ? projects : [];
  },

  getProjectStats(project) {
    const atms = localStorageAdapter.getJson(storageKeys.atmsByProject(project.id), []);
    const activeAtms = Array.isArray(atms) ? atms.filter(atm => !atm.deleted) : [];

    return {
      total: activeAtms.length,
      ready: activeAtms.filter(atm => atm.status === 'ready').length,
      inWork: activeAtms.filter(atm => atm.status === 'process').length
    };
  },

  getPaginatedData(data, page, limit) {
    const start = (page - 1) * limit;
    return {
      items: data.slice(start, start + limit),
      totalPages: Math.ceil(data.length / limit) || 1
    };
  },

  saveProjects(projects) {
    return localStorageAdapter.setJson(storageKeys.projects, projects);
  },

  deleteProject(projects, projectId, userId) {
    return projects.map(p => {
      if (p.id !== projectId) return p;

      if (p.authorId === userId) {
        return { 
          ...p, 
          deletedByAuthor: true, 
          updatedAt: Date.now() 
        };
      }

      const currentHidden = Array.isArray(p.hiddenByUsers) ? p.hiddenByUsers : [];
      if (!currentHidden.includes(userId)) {
        return {
          ...p,
          hiddenByUsers: [...currentHidden, userId],
          updatedAt: Date.now()
        };
      }

      return p;
    });
  },

  restoreProject(projects, projectId, userId) {
    return projects.map(p => {
      if (p.id !== projectId) return p;
      
      if (p.authorId === userId) {
        return { 
          ...p, 
          deletedByAuthor: false, 
          updatedAt: Date.now() 
        };
      }
      
      if (Array.isArray(p.hiddenByUsers)) {
        return {
          ...p,
          hiddenByUsers: p.hiddenByUsers.filter(id => id !== userId), 
          updatedAt: Date.now()
        };
      }

      return p;
    });
  },

  getAllUsers() {
    const projectUsers = localStorageAdapter.getJson(storageKeys.projectUsers, []);
    const authUsers = localStorageAdapter.getJson(storageKeys.authUsers, []);
    const usersByKey = new Map();

    [...projectUsers, ...authUsers]
      .filter(Boolean)
      .map(normalizeUser)
      .forEach(user => {
        const key = user.id || user.login;
        if (key) usersByKey.set(key, user);
      });

    return [...usersByKey.values()];
  },

  createNewProject(formData, user) {
    const timestamp = Date.now();
    return {
      id: `proj_${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name || '',
      typeVS: formData.typeVS || '',
      typeTrainer: formData.typeTrainer || '',
      typeRMI: formData.typeRMI || '',
      authorId: user?.id,
      authorName: user?.fullName,
      ownerId: user?.id,
      ownerName: user?.fullName,
      deletedByAuthor: false,
      hiddenByUsers: [],
      createdAt: timestamp,
      updatedAt: timestamp,
      atms: [],
      stats: { ready: 0, inWork: 0 }
    };
  },

  hasDuplicateProject(projects, formData, { ownerId, excludeId } = {}) {
    if (!Array.isArray(projects)) return false;

    return projects.some(project => {
      if (project.deleted) return false;
      if (excludeId && String(project.id) === String(excludeId)) return false;
      if (ownerId && project.ownerId !== ownerId) return false;

      return isSameProjectFields(project, formData);
    });
  },

  getFilteredProjects(projects, { tab, searchQuery, userId }) {
    if (!Array.isArray(projects)) return [];

    const query = searchQuery.toLowerCase().trim();

    return projects.filter(p => {
      const name = (p.name || '').toLowerCase();
      const vs = (p.typeVS || '').toLowerCase();
      const rmi = (p.typeRMI || '').toLowerCase();

      const matchesSearch = name.includes(query) || vs.includes(query) || rmi.includes(query);
      
      const isOwner = p.authorId === userId || p.ownerId === userId;
      const isSharedToMe = Array.isArray(p.sharedWith) && p.sharedWith.some(share => share.userId === userId);
      
      const isDeletedByAuthor = !!p.deletedByAuthor || p.deleted === true;
      const isHiddenByMe = Array.isArray(p.hiddenByUsers) && p.hiddenByUsers.includes(userId);

      switch (tab) {
        case 'trash':
          if (isOwner && isDeletedByAuthor) return matchesSearch;
          if (!isOwner && isSharedToMe && isHiddenByMe) return matchesSearch;
          return false;
          
        case 'mine':
          return isOwner && !isDeletedByAuthor && matchesSearch;
          
        case 'all':
          return !isOwner && isSharedToMe && !isHiddenByMe && matchesSearch;
          
        default:
          return matchesSearch;
      }
    }).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  },

  cloneProject(projects, project, suffix, user) {
    const timestamp = Date.now();
    const newProject = {
      ...project,
      id: `proj_${timestamp}`,
      name: `${project.name} ${suffix}`,
      ownerId: user?.id,
      ownerName: user?.fullName,
      authorId: user?.id,
      authorName: user?.fullName,
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedByAuthor: false,
      hiddenByUsers: [],
      sharedWith: [],
      atms: project.atms ? [...project.atms] : []
    };

    return [newProject, ...projects];
  },
 
  transferProject(projects, projectId, recipientUser, reason) {
    if (!recipientUser) return projects;

    const recipient = normalizeUser(recipientUser);
    if (!recipient.id) return projects;

    return projects.map(p => {
      if (p.id !== projectId) return p;
      if (p.authorId === recipient.id) return p; 

      const currentShares = Array.isArray(p.sharedWith) ? p.sharedWith : [];
      
      if (currentShares.some(share => share.userId === recipient.id)) return p;

      return {
        ...p,
        updatedAt: Date.now(),
        sharedWith: [
          ...currentShares,
          {
            userId: recipient.id,
            username: recipient.login,
            fullName: recipient.fullName,
            reason: reason,
            sharedAt: Date.now()
          }
        ]
      };
    });
  },

  validateTransfer(recipientLogin, allUsers) {
    if (!recipientLogin || !recipientLogin.trim()) {
      return { isValid: false, errorType: 'required', selectedUser: null };
    }

    const selectedUser = allUsers.find(u => u.login === recipientLogin.trim());
    
    if (!selectedUser) {
      return { isValid: false, errorType: 'notFound', selectedUser: null };
    }

    return { isValid: true, errorType: null, selectedUser };
  }
};
