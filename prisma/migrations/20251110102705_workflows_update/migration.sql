/*
  Warnings:

  - Made the column `userId` on table `workflow` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "workflow" DROP CONSTRAINT "workflow_userId_fkey";

-- AlterTable
ALTER TABLE "workflow" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "workflow" ADD CONSTRAINT "workflow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
