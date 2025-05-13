-- CreateEnum
CREATE TYPE "ColaType" AS ENUM ('ORIGINAL', 'ZERO');

-- AlterTable
ALTER TABLE "Cola" ADD COLUMN     "type" "ColaType" NOT NULL DEFAULT 'ORIGINAL';
