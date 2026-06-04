import { prisma } from '../../shared/prisma/client.js';

function atmSelect() {
  return {
    id: true,
    codeType: true,
    codeValue: true,
    status: true,
    isDeleted: true,
    createdAt: true,
    updatedAt: true,

    creator: {
      select: {
        id: true,
        fullName: true,
        login: true,
      },
    },

    system: true,
    subsystem: true,

    revisions: {
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
      },
    },
  };
}

function mapAtm(atm) {
  const activeRevision = atm.revisions.find((revision) => revision.isActive);
  const latestRevision =
    atm.revisions.length > 0
      ? atm.revisions[atm.revisions.length - 1]
      : null;

  return {
    id: atm.id,

    codeType: atm.codeType,
    codeValue: atm.codeValue,

    system: atm.system,
    subsystem: atm.subsystem,

    systemName: atm.system?.name || null,
    subsystemName: atm.subsystem?.name || null,

    status: atm.status,
    isDeleted: atm.isDeleted,

    author: atm.creator.fullName,
    creator: atm.creator,

    currentRevision: activeRevision || latestRevision,
    latestRevisionNumber: latestRevision?.revisionNumber || 1,

    createdAt: atm.createdAt,
    updatedAt: atm.updatedAt,
  };
}

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

export const atmsService = {
  async createAtm({
    userId,
    projectId,
    codeType,
    codeValue,
    systemId,
    subsystemId,
  }) {
    const { isCreator } = await getProjectAccess({ userId, projectId });

    if (!isCreator) {
      const error = new Error('Создавать ATM может только создатель проекта');
      error.statusCode = 403;
      throw error;
    }

    if (!codeType || !codeValue || !systemId) {
      const error = new Error('Заполните обязательные поля ATM');
      error.statusCode = 400;
      throw error;
    }

    if (!['ATA', 'FSTD'].includes(codeType)) {
      const error = new Error('Некорректный тип кода ATM');
      error.statusCode = 400;
      throw error;
    }

    const system = await prisma.dictionaryAtmSystem.findUnique({
      where: { id: systemId },
      include: {
        subsystems: true,
      },
    });

    if (!system) {
      const error = new Error('Система ATM не найдена');
      error.statusCode = 404;
      throw error;
    }

    if (system.codeType !== codeType || system.code !== codeValue) {
      const error = new Error('Код и выбранная система не совпадают');
      error.statusCode = 400;
      throw error;
    }

    if (subsystemId) {
      const subsystem = await prisma.dictionaryAtmSubsystem.findFirst({
        where: {
          id: subsystemId,
          systemId,
        },
      });

      if (!subsystem) {
        const error = new Error('Подсистема не найдена или не относится к выбранной системе');
        error.statusCode = 400;
        throw error;
      }
    }

    const atm = await prisma.atm.create({
      data: {
        projectId,
        creatorId: userId,
        codeType,
        codeValue,
        systemId,
        subsystemId: subsystemId || null,
        status: 'DRAFT',

        revisions: {
          create: {
            revisionNumber: 1,
            description: 'Первоначальная версия документа',
            reason: null,
            revisionDate: new Date(),
            isActive: true,
            createdById: userId,
            snapshot: {
              titlePage: {},
              approvalSheet: [],
              changeRegistration: [
                {
                  revisionNumber: 1,
                  description: 'Первоначальная версия документа',
                  reason: null,
                  date: new Date().toISOString(),
                },
              ],
              laboratoryEquipment: [],
              documentationList: [],
              tolerances: [],
              abbreviations: [],
              mainPart: [],
              discrepancySheet: {},
            },
          },
        },
      },
      select: atmSelect(),
    });

    return mapAtm(atm);
  },

  async getProjectAtms({ userId, projectId, tab = 'all', search = '' }) {
    await getProjectAccess({ userId, projectId });

    const where = {
      projectId,
    };

    if (tab === 'trash') {
      where.isDeleted = true;
    } else {
      where.isDeleted = false;
    }

    if (tab === 'draft') where.status = 'DRAFT';
    if (tab === 'process') where.status = 'IN_PROGRESS';
    if (tab === 'review') where.status = 'IN_REVIEW';
    if (tab === 'ready') where.status = 'READY';

    if (search) {
      where.OR = [
        {
          codeValue: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          system: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          subsystem: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    const atms = await prisma.atm.findMany({
      where,
      orderBy: {
        updatedAt: 'desc',
      },
      select: atmSelect(),
    });

    return atms.map(mapAtm);
  },

  async getAtmById({ userId, projectId, atmId }) {
    await getProjectAccess({ userId, projectId });

    const atm = await prisma.atm.findFirst({
      where: {
        id: atmId,
        projectId,
      },
      select: atmSelect(),
    });

    if (!atm) {
      const error = new Error('ATM не найден');
      error.statusCode = 404;
      throw error;
    }

    return mapAtm(atm);
  },

  async updateAtm({
    userId,
    projectId,
    atmId,
    codeType,
    codeValue,
    systemId,
    subsystemId,
    status,
  }) {
    const { isCreator } = await getProjectAccess({ userId, projectId });

    if (!isCreator) {
      const error = new Error('Редактировать ATM может только создатель проекта');
      error.statusCode = 403;
      throw error;
    }

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

    const data = {};

    if (codeType !== undefined) data.codeType = codeType;
    if (codeValue !== undefined) data.codeValue = codeValue;
    if (systemId !== undefined) data.systemId = systemId;
    if (subsystemId !== undefined) data.subsystemId = subsystemId || null;

    if (status !== undefined) {
      if (!['DRAFT', 'IN_PROGRESS', 'IN_REVIEW', 'READY'].includes(status)) {
        const error = new Error('Некорректный статус ATM');
        error.statusCode = 400;
        throw error;
      }

      data.status = status;
    }

    const updated = await prisma.atm.update({
      where: { id: atmId },
      data,
      select: atmSelect(),
    });

    return mapAtm(updated);
  },

  async moveAtmToTrash({ userId, projectId, atmId }) {
    const { isCreator } = await getProjectAccess({ userId, projectId });

    if (!isCreator) {
      const error = new Error('Удалить ATM может только создатель проекта');
      error.statusCode = 403;
      throw error;
    }

    const updated = await prisma.atm.update({
      where: { id: atmId },
      data: {
        isDeleted: true,
      },
      select: atmSelect(),
    });

    if (updated.projectId && updated.projectId !== projectId) {
      const error = new Error('ATM не принадлежит указанному проекту');
      error.statusCode = 400;
      throw error;
    }

    return mapAtm(updated);
  },

  async restoreAtm({ userId, projectId, atmId }) {
    const { isCreator } = await getProjectAccess({ userId, projectId });

    if (!isCreator) {
      const error = new Error('Восстановить ATM может только создатель проекта');
      error.statusCode = 403;
      throw error;
    }

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

    const updated = await prisma.atm.update({
      where: { id: atmId },
      data: {
        isDeleted: false,
      },
      select: atmSelect(),
    });

    return mapAtm(updated);
  },

  async eraseAtm({ userId, projectId, atmId }) {
    const { isCreator } = await getProjectAccess({ userId, projectId });

    if (!isCreator) {
      const error = new Error('Стереть ATM может только создатель проекта');
      error.statusCode = 403;
      throw error;
    }

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

    await prisma.atm.delete({
      where: {
        id: atmId,
      },
    });

    return {
      id: atmId,
      deleted: true,
    };
  },
};