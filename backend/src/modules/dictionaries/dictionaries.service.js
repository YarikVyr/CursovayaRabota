import { prisma } from '../../shared/prisma/client.js';

export const dictionariesService = {
  async getAircraftTypes() {
    return prisma.dictionaryAircraftType.findMany({
      orderBy: { name: 'asc' },
    });
  },

  async getTrainerTypes() {
    return prisma.dictionaryTrainerType.findMany({
      orderBy: { name: 'asc' },
    });
  },

  async getRmiTypes() {
    return prisma.dictionaryRmiType.findMany({
      orderBy: { name: 'asc' },
    });
  },

  async getAtmSystems({ codeType }) {
    return prisma.dictionaryAtmSystem.findMany({
      where: codeType ? { codeType } : undefined,
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

  async getAtmSubsystems({ systemId }) {
    return prisma.dictionaryAtmSubsystem.findMany({
      where: systemId ? { systemId } : undefined,
      orderBy: { name: 'asc' },
    });
  },

  async getContracts() {
    return prisma.dictionaryContract.findMany({
      orderBy: { name: 'asc' },
    });
  },

  async getEquipment() {
    return prisma.dictionaryEquipment.findMany({
      orderBy: { name: 'asc' },
    });
  },

  async getTolerances() {
    return prisma.dictionaryTolerance.findMany({
      orderBy: { name: 'asc' },
    });
  },

  async getUnits() {
    return prisma.dictionaryUnit.findMany({
      orderBy: { name: 'asc' },
    });
  },

  async getAbbreviations() {
    return prisma.dictionaryAbbreviation.findMany({
      orderBy: { abbreviation: 'asc' },
    });
  },

  async getAll() {
    const [
      aircraftTypes,
      trainerTypes,
      rmiTypes,
      atmSystems,
      contracts,
      equipment,
      tolerances,
      units,
      abbreviations,
    ] = await Promise.all([
      this.getAircraftTypes(),
      this.getTrainerTypes(),
      this.getRmiTypes(),
      this.getAtmSystems({}),
      this.getContracts(),
      this.getEquipment(),
      this.getTolerances(),
      this.getUnits(),
      this.getAbbreviations(),
    ]);

    return {
      aircraftTypes,
      trainerTypes,
      rmiTypes,
      atmSystems,
      contracts,
      equipment,
      tolerances,
      units,
      abbreviations,
    };
  },
};