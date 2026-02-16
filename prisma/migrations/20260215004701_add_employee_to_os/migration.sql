-- AlterTable
ALTER TABLE `serviceorder` ADD COLUMN `employeeId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `ServiceOrder` ADD CONSTRAINT `ServiceOrder_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
