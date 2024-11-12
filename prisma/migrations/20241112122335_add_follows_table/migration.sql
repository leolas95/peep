-- CreateTable
CREATE TABLE "follows" (
    "follower_id" TEXT NOT NULL,
    "followee_id" TEXT NOT NULL,

    PRIMARY KEY ("follower_id", "followee_id")
);
