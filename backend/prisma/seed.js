import bcrypt from 'bcrypt';
import { prisma } from '../src/shared/prisma/client.js';

async function main() {
  console.log('Start seeding...');

/*AIRCRAFT TYPES*/

  await prisma.dictionaryAircraftType.createMany({
    data: [
      { name: 'МС-21' },
      { name: 'SSJ-100' },
    ],
    skipDuplicates: true,
  });

/*TRAINER TYPES*/

  await prisma.dictionaryTrainerType.createMany({
    data: [
      { name: 'Процедурный' },
      { name: 'Полнопилотажный' },
    ],
    skipDuplicates: true,
  });

/*RMI TYPES*/

  await prisma.dictionaryRmiType.createMany({
    data: [
      { name: 'RMI-1' },
      { name: 'RMI-2' },
    ],
    skipDuplicates: true,
  });

/*ATM SYSTEMS*/

  const hydraulicSystem =
    await prisma.dictionaryAtmSystem.upsert({
      where: {
        codeType_code: {
          codeType: 'ATA',
          code: '29',
        },
      },
      update: {},
      create: {
        codeType: 'ATA',
        code: '29',
        name: 'Гидравлическая система',
      },
    });

  const fuelSystem =
    await prisma.dictionaryAtmSystem.upsert({
      where: {
        codeType_code: {
          codeType: 'ATA',
          code: '28',
        },
      },
      update: {},
      create: {
        codeType: 'ATA',
        code: '28',
        name: 'Топливная система',
      },
    });

/*SUBSYSTEMS*/

  await prisma.dictionaryAtmSubsystem.createMany({
    data: [
      {
        systemId: hydraulicSystem.id,
        name: 'Насосы',
      },
      {
        systemId: hydraulicSystem.id,
        name: 'Гидролинии',
      },
      {
        systemId: fuelSystem.id,
        name: 'Топливные баки',
      },
    ],
    skipDuplicates: true,
  });

/*CONTRACTS*/

  await prisma.dictionaryContract.createMany({
    data: [
      { name: 'Контракт МС-21 2026' },
      { name: 'Контракт SSJ-100 2026' },
    ],
    skipDuplicates: true,
  });

/*EQUIPMENT*/

  await prisma.dictionaryEquipment.createMany({
    data: [
      {
        name: 'Осциллограф',
        model: 'Rigol DS1054Z',
      },
      {
        name: 'Мультиметр',
        model: 'Fluke 87V',
      },
    ],
    skipDuplicates: true,
  });

/*TOLERANCES*/

  await prisma.dictionaryTolerance.createMany({
    data: [
      { name: '±1%' },
      { name: '±5%' },
      { name: '±10%' },
    ],
    skipDuplicates: true,
  });

/*UNITS*/

  await prisma.dictionaryUnit.createMany({
    data: [
      { name: 'Вольт' },
      { name: 'Ампер' },
      { name: 'psi' },
      { name: '°C' },
    ],
    skipDuplicates: true,
  });

/*ABBREVIATIONS*/

  await prisma.dictionaryAbbreviation.createMany({
    data: [
      {
        abbreviation: 'ВС',
        description: 'Воздушное судно',
      },
      {
        abbreviation: 'РМИ',
        description: 'Рабочее место инструктора',
      },
      {
        abbreviation: 'FSTD',
        description: 'Flight Simulation Training Device',
      },
    ],
    skipDuplicates: true,
  });

/*SYSTEM SETTINGS*/

  await prisma.systemSetting.upsert({
    where: {
      key: 'default_language',
    },
    update: {},
    create: {
      key: 'default_language',
      value: 'RU',
    },
  });

/*ADMIN USER*/

  const adminPasswordHash = await bcrypt.hash(
    'admin123',
    10
  );

  await prisma.adminUser.upsert({
    where: {
      login: 'admin',
    },
    update: {},
    create: {
      login: 'admin',
      passwordHash: adminPasswordHash,
    },
  });

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });