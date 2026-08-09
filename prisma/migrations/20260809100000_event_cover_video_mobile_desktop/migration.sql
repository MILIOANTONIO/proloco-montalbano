-- AlterTable
ALTER TABLE "EventItem" ADD COLUMN "coverVideoMobile" TEXT;
ALTER TABLE "EventItem" ADD COLUMN "coverVideoDesktop" TEXT;

UPDATE "EventItem" SET "coverVideoDesktop" = "coverVideo" WHERE "coverVideo" IS NOT NULL;

ALTER TABLE "EventItem" DROP COLUMN "coverVideo";
