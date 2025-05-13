/*
  Warnings:

  - You are about to drop the column `authorId` on the `Cola` table. All the data in the column will be lost.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Cola" DROP CONSTRAINT "Cola_authorId_fkey";

-- AlterTable
ALTER TABLE "Cola" DROP COLUMN "authorId",
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Cola" ADD CONSTRAINT "Cola_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
