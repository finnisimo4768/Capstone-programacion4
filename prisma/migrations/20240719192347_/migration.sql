/*
  Warnings:

  - You are about to drop the column `maps_id` on the `obstacles` table. All the data in the column will be lost.
  - Added the required column `map_id` to the `obstacles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `obstacles` DROP FOREIGN KEY `obstacles_maps_id_fkey`;

-- AlterTable
ALTER TABLE `obstacles` DROP COLUMN `maps_id`,
    ADD COLUMN `map_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `obstacles` ADD CONSTRAINT `obstacles_map_id_fkey` FOREIGN KEY (`map_id`) REFERENCES `maps`(`id_map`) ON DELETE RESTRICT ON UPDATE CASCADE;
