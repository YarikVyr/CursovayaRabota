import { prisma } from '../../shared/prisma/client.js';

export const usersService = {
  async searchUserForShare({ login, fullName, currentUserId }) {
    if (!login || !fullName) {
      const error = new Error('Укажите логин и ФИО пользователя');
      error.statusCode = 400;
      throw error;
    }

    const user = await prisma.user.findFirst({
      where: {
        login,
        fullName,
      },
      select: {
        id: true,
        fullName: true,
        login: true,
        createdAt: true,
      },
    });

    if (!user) {
      const error = new Error('Пользователь с таким логином и ФИО не найден');
      error.statusCode = 404;
      throw error;
    }

    if (user.id === currentUserId) {
      const error = new Error('Нельзя поделиться проектом с самим собой');
      error.statusCode = 400;
      throw error;
    }

    return user;
  },
};