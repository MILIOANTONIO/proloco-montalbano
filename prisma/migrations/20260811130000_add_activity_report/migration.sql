-- CreateTable
CREATE TABLE "ActivityReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "activityId" TEXT,
    "activityName" TEXT NOT NULL,
    "categories" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "notes" TEXT NOT NULL,
    "photo" TEXT,
    "reporterName" TEXT NOT NULL,
    "reporterEmail" TEXT NOT NULL,
    "reporterPhone" TEXT,
    "handled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
