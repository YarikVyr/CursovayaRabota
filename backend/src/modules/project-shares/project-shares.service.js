import { prisma } from '../../shared/prisma/client.js';
import { writeAuditLog } from '../../shared/utils/audit.js';

export const projectSharesService = {
  async shareProject({ userId, projectId, login, fullName }) {
    if (!login || !fullName) {
      const error = new Error('Укажите логин и ФИО пользователя');
      error.statusCode = 400;
      throw error;
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      const error = new Error('Проект не найден');
      error.statusCode = 404;
      throw error;
    }

    if (project.creatorId !== userId) {
      const error = new Error('Делиться проектом может только его создатель');
      error.statusCode = 403;
      throw error;
    }

    const targetUser = await prisma.user.findFirst({
      where: {
        login,
        fullName,
      },
      select: {
        id: true,
        fullName: true,
        login: true,
      },
    });

    if (!targetUser) {
      const error = new Error('Пользователь с таким логином и ФИО не найден');
      error.statusCode = 404;
      throw error;
    }

    if (targetUser.id === userId) {
      const error = new Error('Нельзя поделиться проектом с самим собой');
      error.statusCode = 400;
      throw error;
    }

    const existingShare = await prisma.projectShare.findUnique({
      where: {
        projectId_sharedWithUserId: {
          projectId,
          sharedWithUserId: targetUser.id,
        },
      },
    });

    if (existingShare) {
      const error = new Error('Проект уже доступен этому пользователю');
      error.statusCode = 409;
      throw error;
    }

    const share = await prisma.projectShare.create({
      data: {
        projectId,
        sharedByUserId: userId,
        sharedWithUserId: targetUser.id,
      },
      include: {
        sharedWithUser: {
          select: {
            id: true,
            fullName: true,
            login: true,
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
    });

    await writeAuditLog({
      userId,
      action: 'PROJECT_SHARED',
      entity: 'Project',
      entityId: projectId,
      details: {
        sharedWithUserId: targetUser.id,
        sharedWithLogin: targetUser.login,
        sharedWithFullName: targetUser.fullName,
      },
    });
    return share;
  },

  async getProjectShares({ userId, projectId }) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      const error = new Error('Проект не найден');
      error.statusCode = 404;
      throw error;
    }

    if (project.creatorId !== userId) {
      const error = new Error('Просматривать список доступов может только создатель проекта');
      error.statusCode = 403;
      throw error;
    }

    return prisma.projectShare.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      include: {
        sharedWithUser: {
          select: {
            id: true,
            fullName: true,
            login: true,
            createdAt: true,
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
    });
  },

  async revokeProjectShare({ userId, projectId, shareId }) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      const error = new Error('Проект не найден');
      error.statusCode = 404;
      throw error;
    }

    if (project.creatorId !== userId) {
      const error = new Error('Удалять доступ может только создатель проекта');
      error.statusCode = 403;
      throw error;
    }

    const share = await prisma.projectShare.findFirst({
      where: {
        id: shareId,
        projectId,
      },
    });

    if (!share) {
      const error = new Error('Доступ не найден');
      error.statusCode = 404;
      throw error;
    }

    await prisma.projectShare.delete({
      where: { id: shareId },
    });

    return {
      id: shareId,
      deleted: true,
    };
  },
};