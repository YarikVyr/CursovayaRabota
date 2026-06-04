import { prisma } from '../../shared/prisma/client.js';

const dictionaryMap = {
  aircraftTypes: {
    model: 'dictionaryAircraftType',
    fields: ['name'],
  },
  trainerTypes: {
    model: 'dictionaryTrainerType',
    fields: ['name'],
  },
  rmiTypes: {
    model: 'dictionaryRmiType',
    fields: ['name'],
  },
  contracts: {
    model: 'dictionaryContract',
    fields: ['name'],
  },
  equipment: {
    model: 'dictionaryEquipment',
    fields: ['name', 'model'],
  },
  tolerances: {
    model: 'dictionaryTolerance',
    fields: ['name'],
  },
  units: {
    model: 'dictionaryUnit',
    fields: ['name'],
  },
  abbreviations: {
    model: 'dictionaryAbbreviation',
    fields: ['abbreviation', 'description'],
  },
};

function getDictionaryConfig(type) {
  const config = dictionaryMap[type];

  if (!config) {
    const error = new Error('Неизвестный тип справочника');
    error.statusCode = 400;
    throw error;
  }

  return config;
}

function pickAllowedFields(body, allowedFields) {
  const data = {};

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      data[field] = body[field];
    }
  }

  return data;
}

export const adminDictionariesService = {
  async getDictionary({ type }) {
    const config = getDictionaryConfig(type);

    return prisma[config.model].findMany({
      orderBy: config.fields[0] === 'abbreviation'
        ? { abbreviation: 'asc' }
        : { name: 'asc' },
    });
  },

  async createDictionaryItem({ type, body }) {
    const config = getDictionaryConfig(type);
    const data = pickAllowedFields(body, config.fields);

    if (Object.keys(data).length === 0) {
      const error = new Error('Нет данных для создания записи');
      error.statusCode = 400;
      throw error;
    }

    return prisma[config.model].create({
      data,
    });
  },

  async updateDictionaryItem({ type, id, body }) {
    const config = getDictionaryConfig(type);
    const data = pickAllowedFields(body, config.fields);

    if (Object.keys(data).length === 0) {
      const error = new Error('Нет данных для обновления записи');
      error.statusCode = 400;
      throw error;
    }

    return prisma[config.model].update({
      where: { id },
      data,
    });
  },

  async deleteDictionaryItem({ type, id }) {
    const config = getDictionaryConfig(type);

    await prisma[config.model].delete({
      where: { id },
    });

    return {
      id,
      deleted: true,
    };
  },
};