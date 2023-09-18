/*
  Warnings:

  - You are about to drop the column `transferStations` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "transferStations" TEXT[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "transferStations";
