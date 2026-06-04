-- CreateEnum
CREATE TYPE "AtmCodeType" AS ENUM ('ATA', 'FSTD');

-- CreateEnum
CREATE TYPE "AtmStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'IN_REVIEW', 'READY');

-- CreateEnum
CREATE TYPE "LibraryItemType" AS ENUM ('READONLY', 'EDITABLE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "aircraftTypeId" TEXT NOT NULL,
    "trainerTypeId" TEXT NOT NULL,
    "rmiTypeId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectShare" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "sharedByUserId" TEXT NOT NULL,
    "sharedWithUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectShare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Atm" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "codeType" "AtmCodeType" NOT NULL,
    "codeValue" TEXT NOT NULL,
    "systemId" TEXT NOT NULL,
    "subsystemId" TEXT,
    "status" "AtmStatus" NOT NULL DEFAULT 'DRAFT',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Atm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AtmRevision" (
    "id" TEXT NOT NULL,
    "atmId" TEXT NOT NULL,
    "revisionNumber" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "reason" TEXT,
    "revisionDate" TIMESTAMP(3) NOT NULL,
    "snapshot" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AtmRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DictionaryAircraftType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DictionaryAircraftType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DictionaryTrainerType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DictionaryTrainerType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DictionaryRmiType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DictionaryRmiType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DictionaryAtmSystem" (
    "id" TEXT NOT NULL,
    "codeType" "AtmCodeType" NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DictionaryAtmSystem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DictionaryAtmSubsystem" (
    "id" TEXT NOT NULL,
    "systemId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DictionaryAtmSubsystem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DictionaryContract" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DictionaryContract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DictionaryEquipment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "model" TEXT,

    CONSTRAINT "DictionaryEquipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DictionaryTolerance" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DictionaryTolerance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DictionaryUnit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DictionaryUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DictionaryAbbreviation" (
    "id" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "DictionaryAbbreviation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EditorLibraryItem" (
    "id" TEXT NOT NULL,
    "type" "LibraryItemType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" JSONB,
    "estimatedTimeSeconds" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EditorLibraryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_login_key" ON "AdminUser"("login");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectShare_projectId_sharedWithUserId_key" ON "ProjectShare"("projectId", "sharedWithUserId");

-- CreateIndex
CREATE UNIQUE INDEX "AtmRevision_atmId_revisionNumber_key" ON "AtmRevision"("atmId", "revisionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "DictionaryAircraftType_name_key" ON "DictionaryAircraftType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DictionaryTrainerType_name_key" ON "DictionaryTrainerType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DictionaryRmiType_name_key" ON "DictionaryRmiType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DictionaryAtmSystem_codeType_code_key" ON "DictionaryAtmSystem"("codeType", "code");

-- CreateIndex
CREATE UNIQUE INDEX "DictionaryContract_name_key" ON "DictionaryContract"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DictionaryTolerance_name_key" ON "DictionaryTolerance"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DictionaryUnit_name_key" ON "DictionaryUnit"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DictionaryAbbreviation_abbreviation_key" ON "DictionaryAbbreviation"("abbreviation");

-- CreateIndex
CREATE UNIQUE INDEX "SystemSetting_key_key" ON "SystemSetting"("key");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_aircraftTypeId_fkey" FOREIGN KEY ("aircraftTypeId") REFERENCES "DictionaryAircraftType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_trainerTypeId_fkey" FOREIGN KEY ("trainerTypeId") REFERENCES "DictionaryTrainerType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_rmiTypeId_fkey" FOREIGN KEY ("rmiTypeId") REFERENCES "DictionaryRmiType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectShare" ADD CONSTRAINT "ProjectShare_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectShare" ADD CONSTRAINT "ProjectShare_sharedByUserId_fkey" FOREIGN KEY ("sharedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectShare" ADD CONSTRAINT "ProjectShare_sharedWithUserId_fkey" FOREIGN KEY ("sharedWithUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atm" ADD CONSTRAINT "Atm_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atm" ADD CONSTRAINT "Atm_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atm" ADD CONSTRAINT "Atm_systemId_fkey" FOREIGN KEY ("systemId") REFERENCES "DictionaryAtmSystem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atm" ADD CONSTRAINT "Atm_subsystemId_fkey" FOREIGN KEY ("subsystemId") REFERENCES "DictionaryAtmSubsystem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtmRevision" ADD CONSTRAINT "AtmRevision_atmId_fkey" FOREIGN KEY ("atmId") REFERENCES "Atm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtmRevision" ADD CONSTRAINT "AtmRevision_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DictionaryAtmSubsystem" ADD CONSTRAINT "DictionaryAtmSubsystem_systemId_fkey" FOREIGN KEY ("systemId") REFERENCES "DictionaryAtmSystem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
