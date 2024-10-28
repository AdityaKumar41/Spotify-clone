/*
  Warnings:

  - You are about to drop the `_UserLikedAlbums` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserLikedSongs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserLikedAlbums" DROP CONSTRAINT "_UserLikedAlbums_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserLikedAlbums" DROP CONSTRAINT "_UserLikedAlbums_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserLikedSongs" DROP CONSTRAINT "_UserLikedSongs_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserLikedSongs" DROP CONSTRAINT "_UserLikedSongs_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "providerId" TEXT;

-- DropTable
DROP TABLE "_UserLikedAlbums";

-- DropTable
DROP TABLE "_UserLikedSongs";

-- CreateTable
CREATE TABLE "_UserSavedTracks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UserSavedAlbums" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserSavedTracks_AB_unique" ON "_UserSavedTracks"("A", "B");

-- CreateIndex
CREATE INDEX "_UserSavedTracks_B_index" ON "_UserSavedTracks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserSavedAlbums_AB_unique" ON "_UserSavedAlbums"("A", "B");

-- CreateIndex
CREATE INDEX "_UserSavedAlbums_B_index" ON "_UserSavedAlbums"("B");

-- AddForeignKey
ALTER TABLE "_UserSavedTracks" ADD CONSTRAINT "_UserSavedTracks_A_fkey" FOREIGN KEY ("A") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSavedTracks" ADD CONSTRAINT "_UserSavedTracks_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSavedAlbums" ADD CONSTRAINT "_UserSavedAlbums_A_fkey" FOREIGN KEY ("A") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSavedAlbums" ADD CONSTRAINT "_UserSavedAlbums_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
