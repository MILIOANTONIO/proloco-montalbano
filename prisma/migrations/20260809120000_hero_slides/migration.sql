-- CreateTable
CREATE TABLE "HeroSlide" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT,
    "videoMobile" TEXT,
    "videoDesktop" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Migrate any existing single hero into the first slide
INSERT INTO "HeroSlide" ("id", "order", "image", "videoMobile", "videoDesktop")
SELECT lower(hex(randomblob(16))), 0, "heroImage", "heroVideoMobile", "heroVideoDesktop"
FROM "SiteSettings"
WHERE "id" = 'singleton' AND ("heroImage" IS NOT NULL OR "heroVideoMobile" IS NOT NULL OR "heroVideoDesktop" IS NOT NULL);

-- RedefineTable
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "showAward" BOOLEAN NOT NULL DEFAULT true,
    "showAbout" BOOLEAN NOT NULL DEFAULT true,
    "showCards" BOOLEAN NOT NULL DEFAULT true,
    "showInstall" BOOLEAN NOT NULL DEFAULT true,
    "sectionOrder" TEXT NOT NULL DEFAULT 'award,about,cards,install',
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SiteSettings" ("id", "showAward", "showAbout", "showCards", "showInstall", "sectionOrder", "updatedAt")
SELECT "id", "showAward", "showAbout", "showCards", "showInstall", "sectionOrder", "updatedAt" FROM "SiteSettings";
DROP TABLE "SiteSettings";
ALTER TABLE "new_SiteSettings" RENAME TO "SiteSettings";
PRAGMA foreign_keys=ON;
