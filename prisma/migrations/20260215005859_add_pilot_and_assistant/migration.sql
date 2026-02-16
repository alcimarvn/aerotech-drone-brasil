/*
  Warnings:

  - You are about to drop the column `employeeId` on the `serviceorder` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `serviceorder` DROP FOREIGN KEY `ServiceOrder_employeeId_fkey`;

-- AlterTable
ALTER TABLE `serviceorder` DROP COLUMN `employeeId`,
    ADD COLUMN `assistantId` VARCHAR(191) NULL,
    ADD COLUMN `pilotId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `ServiceOrder` ADD CONSTRAINT `ServiceOrder_pilotId_fkey` FOREIGN KEY (`pilotId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceOrder` ADD CONSTRAINT `ServiceOrder_assistantId_fkey` FOREIGN KEY (`assistantId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
