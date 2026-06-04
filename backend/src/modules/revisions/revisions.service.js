import { prisma } from '../../shared/prisma/client.js';

async function getProjectAccess({ userId, projectId }) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { creatorId: userId },
        {
          shares: {
            some: {
              sharedWithUserId: userId,
            },
          },
        },
      ],
    },
  });

  if (!project) { 
    const error = new Error('Проект не найден или недоступен');
    error.statusCode = 404;
    throw error;
  }

  return {
    project,
    isCreator: project.creatorId === userId,
  };
}

async function getAtmOrThrow({ projectId, atmId }) {
  const atm = await prisma.atm.findFirst({
    where: {
      id: atmId,
      projectId,
    },
  });

  if (!atm) {
    const error = new Error('ATM не найден');
    error.statusCode = 404;
    throw error;
  }

  return atm;
}

export const revisionsService = {
  async getRevisions({ userId, projectId, atmId }) {
    await getProjectAccess({ userId, projectId });
    await getAtmOrThrow({ projectId, atmId });

    return prisma.atmRevision.findMany({
      where: {
        atmId,
      },
      orderBy: {
        revisionNumber: 'asc',
      },
      select: {
        id: true,
        revisionNumber: true,
        description: true,
        reason: true,
        revisionDate: true,
        isActive: true,
        createdAt: true,
        createdBy: {
          select: {
            id: true,
            fullName: true,
            login: true,
          },
        },
      },
    });
  },

  async getRevisionById({ userId, projectId, atmId, revisionId }) {
    await getProjectAccess({ userId, projectId });
    await getAtmOrThrow({ projectId, atmId });

    const revision = await prisma.atmRevision.findFirst({
      where: {
        id: revisionId,
        atmId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            login: true,
          },
        },
      },
    });

    if (!revision) {
      const error = new Error('Ревизия не найдена');
      error.statusCode = 404;
      throw error;
    }

    return revision;
  },

  async createRevision({ userId, projectId, atmId, description, reason }) {
    const { isCreator } = await getProjectAccess({ userId, projectId });

    if (!isCreator) {
      const error = new Error('Создавать ревизии может только создатель проекта');
      error.statusCode = 403;
      throw error;
    }

    await getAtmOrThrow({ projectId, atmId });

    if (!description) {
      const error = new Error('Укажите описание изменений');
      error.statusCode = 400;
      throw error;
    }

    const activeRevision = await prisma.atmRevision.findFirst({
      where: {
        atmId,
        isActive: true,
      },
      orderBy: {
        revisionNumber: 'desc',
      },
    });

    if (!activeRevision) {
      const error = new Error('Активная ревизия не найдена');
      error.statusCode = 400;
      throw error;
    }

    const lastRevision = await prisma.atmRevision.findFirst({
      where: {
        atmId,
      },
      orderBy: {
        revisionNumber: 'desc',
      },
    });

    const nextRevisionNumber = (lastRevision?.revisionNumber || 0) + 1;

    const snapshot = {
      ...activeRevision.snapshot,
      changeRegistration: [
        ...(activeRevision.snapshot?.changeRegistration || []),
        {
          revisionNumber: nextRevisionNumber,
          description,
          reason: reason || null,
          date: new Date().toISOString(),
        },
      ],
    };

    const result = await prisma.$transaction(async (tx) => {
      await tx.atmRevision.updateMany({
        where: {
          atmId,
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });

      const newRevision = await tx.atmRevision.create({
        data: {
          atmId,
          revisionNumber: nextRevisionNumber,
          description,
          reason: reason || null,
          revisionDate: new Date(),
          snapshot,
          isActive: true,
          createdById: userId,
        },
        include: {
          createdBy: {
            select: {
              id: true,
              fullName: true,
              login: true,
            },
          },
        },
      });

      await tx.atm.update({
        where: {
          id: atmId,
        },
        data: {
          updatedAt: new Date(),
        },
      });

      return newRevision;
    });

    return result;
  },
};