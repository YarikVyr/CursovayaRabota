import { prisma } from '../../shared/prisma/client.js';

export const adminUsersService = {
  async getUsers({ search = '' }) {
    return prisma.user.findMany({
      where: search
        ? {
            fullName: {
              contains: search,
              mode: 'insensitive',
            },
          }
        : undefined,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        fullName: true,
        login: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            createdProjects: true,
            createdAtms: true,
            sharedProjectsReceived: true,
          },
        },
      },
    });
  },

  async getUserById({ userId }) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        fullName: true,
        login: true,
        createdAt: true,
        updatedAt: true,
        createdProjects: {
          select: {
            id: true,
            name: true,
            isDeleted: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            updatedAt: 'desc',
          },
        },
        sharedProjectsReceived: {
          select: {
            id: true,
            createdAt: true,
            project: {
              select: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true,
              },
            },
            sharedByUser: {
              select: {
                id: true,
                fullName: true,
                login: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!user) {
      const error = new Error('Пользователь не найден');
      error.statusCode = 404;
      throw error;
    }

    return user;
  },
};