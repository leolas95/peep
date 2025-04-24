-- CreateTable
CREATE TABLE "likes" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "peep_id" UUID NOT NULL,
    "like_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_peep_id_fkey" FOREIGN KEY ("peep_id") REFERENCES "peeps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
