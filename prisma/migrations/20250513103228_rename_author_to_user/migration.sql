/*
  Warnings:

  - Made the column `userId` on table `Cola` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Cola" DROP CONSTRAINT "Cola_userId_fkey";

-- AlterTable
ALTER TABLE "Cola" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Cola" ADD CONSTRAINT "Cola_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
