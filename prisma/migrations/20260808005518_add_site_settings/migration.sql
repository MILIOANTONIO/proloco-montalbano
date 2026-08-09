-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "heroImage" TEXT,
    "showAward" BOOLEAN NOT NULL DEFAULT true,
    "showAbout" BOOLEAN NOT NULL DEFAULT true,
    "showCards" BOOLEAN NOT NULL DEFAULT true,
    "showInstall" BOOLEAN NOT NULL DEFAULT true,
    "sectionOrder" TEXT NOT NULL DEFAULT 'award,about,cards,install',
    "updatedAt" DATETIME NOT NULL
);
