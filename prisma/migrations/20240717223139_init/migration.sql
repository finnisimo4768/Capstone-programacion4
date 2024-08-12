-- CreateTable
CREATE TABLE `maps` (
    `id_map` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `width` INTEGER NOT NULL,
    `height` INTEGER NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_map`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `obstacles` (
    `id_obstacle` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `maps_id` VARCHAR(191) NOT NULL,
    `position_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_obstacle`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `positions` (
    `id_position` VARCHAR(191) NOT NULL,
    `X` INTEGER NOT NULL,
    `Y` INTEGER NOT NULL,

    PRIMARY KEY (`id_position`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rutes` (
    `id_rute` VARCHAR(191) NOT NULL,
    `distance` INTEGER NOT NULL,
    `start` VARCHAR(191) NOT NULL,
    `end` VARCHAR(191) NOT NULL,
    `game_id` INTEGER NOT NULL,
    `map_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_rute`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id_user` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_password_key`(`password`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `waypoints` (
    `id_waypoints` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `position_id` VARCHAR(191) NOT NULL,
    `map_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_waypoints`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `maps` ADD CONSTRAINT `maps_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `obstacles` ADD CONSTRAINT `obstacles_maps_id_fkey` FOREIGN KEY (`maps_id`) REFERENCES `maps`(`id_map`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `obstacles` ADD CONSTRAINT `obstacles_position_id_fkey` FOREIGN KEY (`position_id`) REFERENCES `positions`(`id_position`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rutes` ADD CONSTRAINT `rutes_map_id_fkey` FOREIGN KEY (`map_id`) REFERENCES `maps`(`id_map`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `waypoints` ADD CONSTRAINT `waypoints_position_id_fkey` FOREIGN KEY (`position_id`) REFERENCES `positions`(`id_position`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `waypoints` ADD CONSTRAINT `waypoints_map_id_fkey` FOREIGN KEY (`map_id`) REFERENCES `maps`(`id_map`) ON DELETE RESTRICT ON UPDATE CASCADE;
