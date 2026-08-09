-- RedefineTable
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EventItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "location" TEXT,
    "coverImage" TEXT,
    "coverVideoMobile" TEXT,
    "coverVideoDesktop" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_EventItem" ("id", "startDate", "endDate", "location", "coverImage", "coverVideoMobile", "coverVideoDesktop", "published")
SELECT "id", "startDate", "endDate", "location", "coverImage", "coverVideoMobile", "coverVideoDesktop", "published" FROM "EventItem";
DROP TABLE "EventItem";
ALTER TABLE "new_EventItem" RENAME TO "EventItem";
PRAGMA foreign_keys=ON;
