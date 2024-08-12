/*
  Warnings:

  - The primary key for the `routes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_rute` on the `routes` table. All the data in the column will be lost.
  - The required column `id_route` was added to the `routes` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `routes` DROP PRIMARY KEY,
    DROP COLUMN `id_rute`,
    ADD COLUMN `id_route` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id_route`);
