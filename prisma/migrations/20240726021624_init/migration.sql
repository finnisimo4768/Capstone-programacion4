/*
  Warnings:

  - The primary key for the `waypoints` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_waypoints` on the `waypoints` table. All the data in the column will be lost.
  - You are about to drop the `rutes` table. If the table is not empty, all the data it contains will be lost.
  - The required column `id_waypoint` was added to the `waypoints` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `rutes` DROP FOREIGN KEY `rutes_map_id_fkey`;

-- AlterTable
ALTER TABLE `waypoints` DROP PRIMARY KEY,
    DROP COLUMN `id_waypoints`,
    ADD COLUMN `id_waypoint` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id_waypoint`);

-- DropTable
DROP TABLE `rutes`;

-- CreateTable
CREATE TABLE `routes` (
    `id_rute` VARCHAR(191) NOT NULL,
    `distance` INTEGER NOT NULL,
    `startx` INTEGER NOT NULL,
    `starty` INTEGER NOT NULL,
    `endx` INTEGER NOT NULL,
    `endy` INTEGER NOT NULL,
    `map_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_rute`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `routes` ADD CONSTRAINT `routes_map_id_fkey` FOREIGN KEY (`map_id`) REFERENCES `maps`(`id_map`) ON DELETE RESTRICT ON UPDATE CASCADE;
