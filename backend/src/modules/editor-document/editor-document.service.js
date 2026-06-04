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
    include: {
      system: true,
      subsystem: true,
      project: {
        include: {
          aircraftType: true,
          trainerType: true,
          rmiType: true,
        },
      },
    },
  });

  if (!atm) {
    const error = new Error('ATM не найден');
    error.statusCode = 404;
    throw error;
  }

  return atm;
}

async function getActiveRevisionOrThrow({ atmId }) {
  const revision = await prisma.atmRevision.findFirst({
    where: {
      atmId,
      isActive: true,
    },
    orderBy: {
      revisionNumber: 'desc',
    },
  });

  if (!revision) {
    const error = new Error('Активная ревизия не найдена');
    error.statusCode = 404;
    throw error;
  }

  return revision;
}

function createReadonlyMeta(atm) {
  return {
    project: {
      id: atm.project.id,
      name: atm.project.name,
      aircraftType: atm.project.aircraftType,
      trainerType: atm.project.trainerType,
      rmiType: atm.project.rmiType,
    },
    atm: {
      id: atm.id,
      codeType: atm.codeType,
      codeValue: atm.codeValue,
      status: atm.status,
      system: atm.system,
      subsystem: atm.subsystem,
    },
  };
}

export const editorDocumentService = {
  async getEditorDocument({ userId, projectId, atmId }) {
    const { isCreator } = await getProjectAccess({ userId, projectId });
    const atm = await getAtmOrThrow({ projectId, atmId });
    const activeRevision = await getActiveRevisionOrThrow({ atmId });

    return {
      readonly: !isCreator,
      meta: createReadonlyMeta(atm),
      revision: {
        id: activeRevision.id,
        revisionNumber: activeRevision.revisionNumber,
        description: activeRevision.description,
        reason: activeRevision.reason,
        revisionDate: activeRevision.revisionDate,
        isActive: activeRevision.isActive,
        createdAt: activeRevision.createdAt,
      },
      snapshot: activeRevision.snapshot,
    };
  },

  async updateEditorDocument({ userId, projectId, atmId, snapshotPatch }) {
    const { isCreator } = await getProjectAccess({ userId, projectId });

    if (!isCreator) {
      const error = new Error('Редактировать документ может только создатель проекта');
      error.statusCode = 403;
      throw error;
    }

    await getAtmOrThrow({ projectId, atmId });

    const activeRevision = await getActiveRevisionOrThrow({ atmId });

    const currentSnapshot = activeRevision.snapshot || {};

    const allowedKeys = [
      'titlePage',
      'approvalSheet',
      'changeRegistration',
      'laboratoryEquipment',
      'documentationList',
      'tolerances',
      'abbreviations',
      'mainPart',
      'discrepancySheet',
    ];

    const safePatch = {};

    for (const key of allowedKeys) {
      if (Object.prototype.hasOwnProperty.call(snapshotPatch, key)) {
        safePatch[key] = snapshotPatch[key];
      }
    }

    const nextSnapshot = {
      ...currentSnapshot,
      ...safePatch,
    };

    const updatedRevision = await prisma.atmRevision.update({
      where: {
        id: activeRevision.id,
      },
      data: {
        snapshot: nextSnapshot,
      },
    });

    await prisma.atm.update({
      where: {
        id: atmId,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    return {
      revision: {
        id: updatedRevision.id,
        revisionNumber: updatedRevision.revisionNumber,
        isActive: updatedRevision.isActive,
        updatedAt: new Date(),
      },
      snapshot: updatedRevision.snapshot,
    };
  },
};