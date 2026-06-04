import { localStorageAdapter, storageKeys } from '@/shared/lib/storage/localStorageAdapter';

const toUserSession = (user) => ({ 
  id: user.id,
  username: user.username,
  fullName: user.fullName,
  role: user.role
});
 
export const AuthService = {
  async submit(action, formData) {
    const users = localStorageAdapter.getJson(storageKeys.authUsers, []);

    if (action === 'register') {
      const userExists = users.find(u => u.username === formData.username);

      if (userExists) {
        throw new Error('USER_EXISTS');
      }

      const newUser = {
        id: Date.now().toString(),
        username: formData.username,
        fullName: formData.fullName || formData.username,
        password: formData.password,
        role: 'Пользователь'
      };

      users.push(newUser);
      localStorageAdapter.setJson(storageKeys.authUsers, users);

      return toUserSession(newUser);
    }

    if (action === 'login') {
      const user = users.find(
        u => u.username === formData.username && u.password === formData.password
      );

      if (!user) {
        throw new Error('INVALID_AUTH');
      }

      return toUserSession(user);
    }

    throw new Error('UNKNOWN_ACTION');
  }
};
