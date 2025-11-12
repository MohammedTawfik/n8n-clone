/*
  Warnings:

  - You are about to drop the `edge` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "edge" DROP CONSTRAINT "edge_sourceNodeId_fkey";

-- DropForeignKey
ALTER TABLE "edge" DROP CONSTRAINT "edge_targetNodeId_fkey";

-- DropForeignKey
ALTER TABLE "edge" DROP CONSTRAINT "edge_workflowId_fkey";

-- DropTable
DROP TABLE "edge";

-- CreateTable
CREATE TABLE "Connection" (
    "id" TEXT NOT NULL,
    "sourceNodeId" TEXT NOT NULL,
    "targetNodeId" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromOutput" TEXT DEFAULT 'main',
    "toInput" TEXT DEFAULT 'main',

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Connection_sourceNodeId_targetNodeId_fromOutput_toInput_key" ON "Connection"("sourceNodeId", "targetNodeId", "fromOutput", "toInput");

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_sourceNodeId_fkey" FOREIGN KEY ("sourceNodeId") REFERENCES "node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_targetNodeId_fkey" FOREIGN KEY ("targetNodeId") REFERENCES "node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
