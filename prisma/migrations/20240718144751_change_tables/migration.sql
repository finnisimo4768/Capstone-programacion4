/*
  Warnings:

  - You are about to drop the column `position_id` on the `obstacles` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `obstacles` table. All the data in the column will be lost.
  - You are about to drop the column `position_id` on the `waypoints` table. All the data in the column will be lost.
  - You are about to drop the `positions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `x` to the `obstacles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `y` to the `obstacles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `x` to the `waypoints` table without a default value. This is not possible if the table is not empty.
  - Added the required column `y` to the `waypoints` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `obstacles` DROP FOREIGN KEY `obstacles_position_id_fkey`;

-- DropForeignKey
ALTER TABLE `waypoints` DROP FOREIGN KEY `waypoints_position_id_fkey`;

-- AlterTable
ALTER TABLE `obstacles` DROP COLUMN `position_id`,
    DROP COLUMN `size`,
    ADD COLUMN `x` INTEGER NOT NULL,
    ADD COLUMN `y` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `waypoints` DROP COLUMN `position_id`,
    ADD COLUMN `x` INTEGER NOT NULL,
    ADD COLUMN `y` INTEGER NOT NULL;

-- DropTable
DROP TABLE `positions`;
