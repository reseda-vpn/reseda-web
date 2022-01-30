/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `lcs` VARCHAR(255) NULL,
    ADD COLUMN `maxDown` INTEGER NOT NULL DEFAULT 5368709120,
    ADD COLUMN `maxUp` INTEGER NOT NULL DEFAULT 5368709120,
    ADD COLUMN `tier` VARCHAR(255) NOT NULL DEFAULT 'FREE',
    MODIFY `name` VARCHAR(255) NULL;

-- DropTable
DROP TABLE `Post`;

-- DropTable
DROP TABLE `Profile`;

-- CreateTable
CREATE TABLE `Lead` (
    `email` VARCHAR(191) NOT NULL,
    `id` VARCHAR(191) NOT NULL,
    `signupAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Lead_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Server` (
    `id` VARCHAR(255) NOT NULL,
    `serverUp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `location` VARCHAR(1000) NOT NULL,
    `country` VARCHAR(1000) NOT NULL,
    `virtual` BOOLEAN NOT NULL DEFAULT false,
    `hostname` VARCHAR(10000) NOT NULL,
    `flag` VARCHAR(1000) NOT NULL,

    UNIQUE INDEX `Server_id_key`(`id`),
    UNIQUE INDEX `Server_hostname_key`(`hostname`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
