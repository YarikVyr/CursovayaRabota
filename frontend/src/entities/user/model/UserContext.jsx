/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import { localStorageAdapter, storageKeys } from '@/shared/lib/storage/localStorageAdapter';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return localStorageAdapter.getJson(storageKeys.currentUser, null);
  });

  const login = (userData) => {
    setUser(userData);
    localStorageAdapter.setJson(storageKeys.currentUser, userData);
  };

  const logout = () => {
    setUser(null);
    localStorageAdapter.remove(storageKeys.currentUser);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
