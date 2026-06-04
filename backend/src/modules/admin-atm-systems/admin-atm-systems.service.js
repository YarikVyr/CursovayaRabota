import { prisma } from '../../shared/prisma/client.js';

function validateCodeType(codeType) {
  if (!['ATA', 'FSTD'].includes(codeType)) {
    const error = new Error('Некорректный тип кода. Допустимо: ATA или FSTD');
    error.statusCode = 400;
    throw error;
  }
}

export const adminAtmSystemsService = {
  async getSystems({ codeType }) {
    const where = {};

    if (codeType) {
      validateCodeType(codeType);
      where.codeType = codeType;
    }

    return prisma.dictionaryAtmSystem.findMany({
      where,
      orderBy: [
        { codeType: 'asc' },
        { code: 'asc' },
      ],
      include: {
        subsystems: {
          orderBy: { name: 'asc' },
        },
      },
    });
  },

  async createSystem({ codeType, code, name }) {
    if (!codeType || !code || !name) {
      const error = new Error('Укажите тип кода, код и название системы');
      error.statusCode = 400;
      throw error;
    }

    validateCodeType(codeType);

    return prisma.dictionaryAtmSystem.create({
      data: {
        codeType,
        code,
        name,
      },
      include: {
        subsystems: true,
      },
    });
  },

  async updateSystem({ systemId, codeType, code, name }) {
    const existing = await prisma.dictionaryAtmSystem.findUnique({
      where: { id: systemId },
    });

    if (!existing) {
      const error = new Error('Система не найдена');
      error.statusCode = 404;
      throw error;
    }

    const data = {};

    if (codeType !== undefined) {
      validateCodeType(codeType);
      data.codeType = codeType;
    }

    if (code !== undefined) data.code = code;
    if (name !== undefined) data.name = name;

    if (Object.keys(data).length === 0) {
      const error = new Error('Нет данных для обновления системы');
      error.statusCode = 400;
      throw error;
    }

    return prisma.dictionaryAtmSystem.update({
      where: { id: systemId },
      data,
      include: {
        subsystems: {
          orderBy: { name: 'asc' },
        },
      },
    });
  },

  async deleteSystem({ systemId }) {
    const existing = await prisma.dictionaryAtmSystem.findUnique({
      where: { id: systemId },
      include: {
        atms: {
          select: { id: true },
        },
        subsystems: {
          select: { id: true },
        },
      },
    });

    if (!existing) {
      const error = new Error('Система не найдена');
      error.statusCode = 404;
      throw error;
    }

    if (existing.atms.length > 0) {
      const error = new Error('Нельзя удалить систему, которая используется в ATM');
      error.statusCode = 409;
      throw error;
    }

    await prisma.dictionaryAtmSystem.delete({
      where: { id: systemId },
    });

    return {
      id: systemId,
      deleted: true,
    };
  },

  async createSubsystem({ systemId, name }) {
    if (!name) {
      const error = new Error('Укажите название подсистемы');
      error.statusCode = 400;
      throw error;
    }

    const system = await prisma.dictionaryAtmSystem.findUnique({
      where: { id: systemId },
    });

    if (!system) {
      const error = new Error('Система не найдена');
      error.statusCode = 404;
      throw error;
    }

    return prisma.dictionaryAtmSubsystem.create({
      data: {
        systemId,
        name,
      },
    });
  },

  async updateSubsystem({ subsystemId, name }) {
    if (!name) {
      const error = new Error('Укажите название подсистемы');
      error.statusCode = 400;
      throw error;
    }

    const existing = await prisma.dictionaryAtmSubsystem.findUnique({
      where: { id: subsystemId },
    });

    if (!existing) {
      const error = new Error('Подсистема не найдена');
      error.statusCode = 404;
      throw error;
    }

    return prisma.dictionaryAtmSubsystem.update({
      where: { id: subsystemId },
      data: {
        name,
      },
    });
  },

  async deleteSubsystem({ subsystemId }) {
    const existing = await prisma.dictionaryAtmSubsystem.findUnique({
      where: { id: subsystemId },
      include: {
        atms: {
          select: { id: true },
        },
      },
    });

    if (!existing) {
      const error = new Error('Подсистема не найдена');
      error.statusCode = 404;
      throw error;
    }

    if (existing.atms.length > 0) {
      const error = new Error('Нельзя удалить подсистему, которая используется в ATM');
      error.statusCode = 409;
      throw error;
    }

    await prisma.dictionaryAtmSubsystem.delete({
      where: { id: subsystemId },
    });

    return {
      id: subsystemId,
      deleted: true,
    };
  },
};