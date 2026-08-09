-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "heroImage" TEXT,
    "heroVideoMobile" TEXT,
    "heroVideoDesktop" TEXT,
    "showAward" BOOLEAN NOT NULL DEFAULT true,
    "showAbout" BOOLEAN NOT NULL DEFAULT true,
    "showCards" BOOLEAN NOT NULL DEFAULT true,
    "showInstall" BOOLEAN NOT NULL DEFAULT true,
    "sectionOrder" TEXT NOT NULL DEFAULT 'award,about,cards,install',
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SiteSettings" ("heroImage", "id", "sectionOrder", "showAbout", "showAward", "showCards", "showInstall", "updatedAt") SELECT "heroImage", "id", "sectionOrder", "showAbout", "showAward", "showCards", "showInstall", "updatedAt" FROM "SiteSettings";
DROP TABLE "SiteSettings";
ALTER TABLE "new_SiteSettings" RENAME TO "SiteSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
