-- CreateTable
CREATE TABLE "PoiChapter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "poiId" TEXT NOT NULL,
    CONSTRAINT "PoiChapter_poiId_fkey" FOREIGN KEY ("poiId") REFERENCES "PointOfInterest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PoiChapterTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "locale" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "audioUrl" TEXT,
    "videoUrl" TEXT,
    "chapterId" TEXT NOT NULL,
    CONSTRAINT "PoiChapterTranslation_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "PoiChapter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "PoiChapterTranslation_chapterId_locale_key" ON "PoiChapterTranslation"("chapterId", "locale");
