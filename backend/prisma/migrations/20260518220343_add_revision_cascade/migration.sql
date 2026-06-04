-- DropForeignKey
ALTER TABLE "AtmRevision" DROP CONSTRAINT "AtmRevision_atmId_fkey";

-- AddForeignKey
ALTER TABLE "AtmRevision" ADD CONSTRAINT "AtmRevision_atmId_fkey" FOREIGN KEY ("atmId") REFERENCES "Atm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
