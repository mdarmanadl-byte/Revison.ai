/*
  Warnings:

  - You are about to drop the `embedding` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "embedding" DROP CONSTRAINT "embedding_chunk_id_fkey";

-- DropTable
DROP TABLE "embedding";

-- CreateTable
CREATE TABLE "Embedding" (
    "id" SERIAL NOT NULL,
    "chunk_id" INTEGER NOT NULL,
    "vector" vector(2048) NOT NULL,
    "model" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Embedding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Embedding_chunk_id_key" ON "Embedding"("chunk_id");

-- AddForeignKey
ALTER TABLE "Embedding" ADD CONSTRAINT "Embedding_chunk_id_fkey" FOREIGN KEY ("chunk_id") REFERENCES "DocumentChunk"("id") ON DELETE CASCADE ON UPDATE CASCADE;
