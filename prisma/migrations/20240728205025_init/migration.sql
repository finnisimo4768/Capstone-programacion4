/*
  Warnings:

  - A unique constraint covering the columns `[path_id]` on the table `maps` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `maps` ADD COLUMN `path_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `paths` (
    `id_path` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `paths_path_key`(`path`),
    PRIMARY KEY (`id_path`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `maps_path_id_key` ON `maps`(`path_id`);

-- AddForeignKey
ALTER TABLE `maps` ADD CONSTRAINT `maps_path_id_fkey` FOREIGN KEY (`path_id`) REFERENCES `paths`(`id_path`) ON DELETE SET NULL ON UPDATE CASCADE;
