/*
  Warnings:

  - The primary key for the `RefundRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ticketId` on the `RefundRequest` table. All the data in the column will be lost.
  - You are about to drop the `OTP` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Route` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Station` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ticket` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VirtualRide` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `RefundRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tripId` to the `RefundRequest` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `routeId` on the `Schedule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `isSenior` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('Monthly', 'Quarterly', 'Annual');

-- CreateEnum
CREATE TYPE "RouteId" AS ENUM ('one', 'two', 'three');

-- CreateEnum
CREATE TYPE "RideStatus" AS ENUM ('completed', 'cancelled', 'ongoing');

-- DropForeignKey
ALTER TABLE "OTP" DROP CONSTRAINT "OTP_userId_fkey";

-- DropForeignKey
ALTER TABLE "RefundRequest" DROP CONSTRAINT "RefundRequest_reviewedBy_fkey";

-- DropForeignKey
ALTER TABLE "RefundRequest" DROP CONSTRAINT "RefundRequest_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_destinationId_fkey";

-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_originId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_routeId_fkey";

-- DropForeignKey
ALTER TABLE "SeniorRequest" DROP CONSTRAINT "SeniorRequest_reviewedBy_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_userId_fkey";

-- DropForeignKey
ALTER TABLE "VirtualRide" DROP CONSTRAINT "VirtualRide_routeId_fkey";

-- DropForeignKey
ALTER TABLE "VirtualRide" DROP CONSTRAINT "VirtualRide_userId_fkey";

-- AlterTable
ALTER TABLE "RefundRequest" DROP CONSTRAINT "RefundRequest_pkey",
DROP COLUMN "ticketId",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "tripId" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "createdAt" DROP DEFAULT,
ADD CONSTRAINT "RefundRequest_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "RefundRequest_id_seq";

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "routeId",
ADD COLUMN     "routeId" "RouteId" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isSenior" BOOLEAN NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "subscription" "SubscriptionType",
ADD COLUMN     "transferStations" TEXT[];

-- DropTable
DROP TABLE "OTP";

-- DropTable
DROP TABLE "Route";

-- DropTable
DROP TABLE "Station";

-- DropTable
DROP TABLE "Ticket";

-- DropTable
DROP TABLE "VirtualRide";

-- DropEnum
DROP TYPE "Subscription";

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "startLocation" TEXT NOT NULL,
    "purchasedAt" TIMESTAMP(3) NOT NULL,
    "status" "RideStatus" NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "route" "RouteId" NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefundRequest" ADD CONSTRAINT "RefundRequest_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefundRequest" ADD CONSTRAINT "RefundRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
