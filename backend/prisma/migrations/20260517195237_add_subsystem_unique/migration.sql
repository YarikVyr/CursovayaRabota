/*
  Warnings:

  - A unique constraint covering the columns `[systemId,name]` on the table `DictionaryAtmSubsystem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DictionaryAtmSubsystem_systemId_name_key" ON "DictionaryAtmSubsystem"("systemId", "name");
