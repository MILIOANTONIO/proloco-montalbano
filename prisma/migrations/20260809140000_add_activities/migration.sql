-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "coverImage" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ActivityTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "locale" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    CONSTRAINT "ActivityTranslation_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ActivityTranslation_activityId_locale_key" ON "ActivityTranslation"("activityId", "locale");

-- RedefineTable
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "showAward" BOOLEAN NOT NULL DEFAULT true,
    "showAbout" BOOLEAN NOT NULL DEFAULT true,
    "showCards" BOOLEAN NOT NULL DEFAULT true,
    "showAttivita" BOOLEAN NOT NULL DEFAULT true,
    "showInstall" BOOLEAN NOT NULL DEFAULT true,
    "sectionOrder" TEXT NOT NULL DEFAULT 'award,about,cards,attivita,install',
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SiteSettings" ("id", "showAward", "showAbout", "showCards", "showAttivita", "showInstall", "sectionOrder", "updatedAt")
SELECT "id", "showAward", "showAbout", "showCards", true, "showInstall",
    CASE WHEN instr("sectionOrder", 'attivita') > 0 THEN "sectionOrder" ELSE replace("sectionOrder", 'cards', 'cards,attivita') END,
    "updatedAt"
FROM "SiteSettings";
DROP TABLE "SiteSettings";
ALTER TABLE "new_SiteSettings" RENAME TO "SiteSettings";
PRAGMA foreign_keys=ON;
