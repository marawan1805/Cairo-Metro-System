/*
  Warnings:

  - You are about to drop the column `nationalId` on the `SeniorRequest` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `subscription` on the `User` table. All the data in the column will be lost.
  - Added the required column `expiryDate` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- DropIndex
DROP INDEX "Subscription_userId_key";

-- AlterTable
ALTER TABLE "SeniorRequest" DROP COLUMN "nationalId";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "expiresAt",
DROP COLUMN "userId",
ADD COLUMN     "expiryDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "subscription",
ADD COLUMN     "subscriptionId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
