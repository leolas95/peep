/*
  Warnings:

  - A unique constraint covering the columns `[peep_id]` on the table `likes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "likes_peep_id_key" ON "likes"("peep_id");
