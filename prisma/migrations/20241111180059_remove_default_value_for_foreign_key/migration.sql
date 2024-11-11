-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_peep" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "peep_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_peep" ("content", "created_at", "id", "user_id") SELECT "content", "created_at", "id", "user_id" FROM "peep";
DROP TABLE "peep";
ALTER TABLE "new_peep" RENAME TO "peep";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
