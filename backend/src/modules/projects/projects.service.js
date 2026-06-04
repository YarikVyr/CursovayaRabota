import { prisma } from '../../shared/prisma/client.js';
import { writeAuditLog } from '../../shared/utils/audit.js';

function projectSelect() {
  return {
    id: true,
    name: true,
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

    aircraftType: true,
    trainerType: true,
    rmiType: true,

    atms: {
      select: {
        id: true,
        status: true,
        isDeleted: true,
      },
    },
  };
}

function mapProject(project) {
  const activeAtms = project.atms.filter((atm) => !atm.isDeleted);

  return {
    id: project.id,
    name: project.name,
    isDeleted: project.isDeleted,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,

    author: project.creator.fullName,
    creator: project.creator,

    aircraftType: project.aircraftType,
    trainerType: project.trainerType,
    rmiType: project.rmiType,

    counters: {
      totalAtms: activeAtms.length,
      readyAtms: activeAtms.filter((atm) => atm.status === 'READY').length,
      inProgressAtms: activeAtms.filter((atm) => atm.status === 'IN_PROGRESS').length,
    },
  };
}

export const projectsService = {
  async createProject({ userId, name, aircraftTypeId, trainerTypeId, rmiTypeId }) {
    if (!name || !aircraftTypeId || !trainerTypeId || !rmiTypeId) {
      const error = new Error('Заполните все обязательные поля проекта');
      error.statusCode = 400;
      throw error;
    }

    const project = await prisma.project.create({
      data: {
        name,
        aircraftTypeId,
        trainerTypeId,
        rmiTypeId,
        creatorId: userId,
      },
      select: projectSelect(),
    });

    await writeAuditLog({
      userId,
      action: 'PROJECT_CREATED',
      entity: 'Project',
      entityId: project.id,
      details: {
        name: project.name,
      },
    });

    return mapProject(project);
  },

  async getMyProjects({ userId }) {
    const projects = await prisma.project.findMany({
      where: {
        isDeleted: false,
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
      orderBy: {
        updatedAt: 'desc',
      },
      select: projectSelect(),
    });

    return projects.map(mapProject);
  },

  async getAllProjects({ userId, page = 1, limit = 9 }) {
    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      isDeleted: false,
      creatorId: {
        not: userId,
      },
    };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: {
          updatedAt: 'desc',
        },
        select: projectSelect(),
      }),
      prisma.project.count({ where }),
    ]);

    return {
      items: projects.map(mapProject),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  },

  async getTrashProjects({ userId }) {
    const projects = await prisma.project.findMany({
      where: {
        creatorId: userId,
        isDeleted: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: projectSelect(),
    });

    return projects.map(mapProject);
  },

  async getProjectById({ userId, projectId }) {
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
          {
            creatorId: {
              not: userId,
            },
          },
        ],
      },
      select: projectSelect(),
    });

    if (!project) {
      const error = new Error('Проект не найден');
      error.statusCode = 404;
      throw error;
    }

    return mapProject(project);
  },

  async updateProject({ userId, projectId, name, aircraftTypeId, trainerTypeId, rmiTypeId }) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      const error = new Error('Проект не найден');
      error.statusCode = 404;
      throw error;
    }

    if (project.creatorId !== userId) {
      const error = new Error('Редактировать проект может только его создатель');
      error.statusCode = 403;
      throw error;
    }

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        name,
        aircraftTypeId,
        trainerTypeId,
        rmiTypeId,
      },
      select: projectSelect(),
    });

    await writeAuditLog({
      userId,
      action: 'PROJECT_UPDATED',
      entity: 'Project',
      entityId: updated.id,
      details: {
        name: updated.name,
      },
    });
    return mapProject(updated);
  },

  async moveToTrash({ userId, projectId }) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      const error = new Error('Проект не найден');
      error.statusCode = 404;
      throw error;
    }

    if (project.creatorId !== userId) {
      const error = new Error('Удалить проект может только его создатель');
      error.statusCode = 403;
      throw error;
    }

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        isDeleted: true,
      },
      select: projectSelect(),
    });

    await writeAuditLog({
      userId,
      action: 'PROJECT_MOVED_TO_TRASH',
      entity: 'Project',
      entityId: updated.id,
      details: {
        name: updated.name,
      },
    });
    return mapProject(updated);
  },

  async restoreProject({ userId, projectId }) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      const error = new Error('Проект не найден');
      error.statusCode = 404;
      throw error;
    }

    if (project.creatorId !== userId) {
      const error = new Error('Восстановить проект может только его создатель');
      error.statusCode = 403;
      throw error;
    }

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        isDeleted: false,
      },
      select: projectSelect(),
    });

    await writeAuditLog({
      userId,
      action: 'PROJECT_RESTORED',
      entity: 'Project',
      entityId: updated.id,
      details: {
        name: updated.name,
      },
    });
    return mapProject(updated);
  },

  async copyProject({ userId, projectId }) {
    const source = await prisma.project.findFirst({
      where: {
        id: projectId,
        creatorId: userId,
      },
      include: {
        atms: {
          include: {
            revisions: true,
          },
        },
      },
    });

    if (!source) {
      const error = new Error('Копировать можно только свой проект');
      error.statusCode = 403;
      throw error;
    }

    const copied = await prisma.project.create({
      data: {
        name: `${source.name} (Копия)`,
        aircraftTypeId: source.aircraftTypeId,
        trainerTypeId: source.trainerTypeId,
        rmiTypeId: source.rmiTypeId,
        creatorId: userId,
        atms: {
          create: source.atms.map((atm) => ({
            creatorId: userId,
            codeType: atm.codeType,
            codeValue: atm.codeValue,
            systemId: atm.systemId,
            subsystemId: atm.subsystemId,
            status: atm.status,
            isDeleted: false,
            revisions: {
              create: atm.revisions.map((revision) => ({
                revisionNumber: revision.revisionNumber,
                description: revision.description,
                reason: revision.reason,
                revisionDate: revision.revisionDate,
                snapshot: revision.snapshot,
                isActive: revision.isActive,
                createdById: userId,
              })),
            },
          })),
        },
      },
      select: projectSelect(),
    });

    await writeAuditLog({
      userId,
      action: 'PROJECT_COPIED',
      entity: 'Project',
      entityId: copied.id,
      details: {
        sourceProjectId: projectId,
        name: copied.name,
      },
    });
    return mapProject(copied);
  },
};