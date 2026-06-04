export const storageKeys = {
  currentUser: 'atm_current_user',
  authUsers: 'atm_users_list',
  projectUsers: 'atm_users_database',
  projects: 'atm_projects',
  atmsByProject: (projectId) => `atms_v3_${projectId || 'default'}`
};

export const localStorageAdapter = {
  getJson(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.error(`Failed to read localStorage key "${key}"`, error);
      return fallback;
    }
  },

  setJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Failed to write localStorage key "${key}"`, error);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove localStorage key "${key}"`, error);
      return false;
    }
  }
};
