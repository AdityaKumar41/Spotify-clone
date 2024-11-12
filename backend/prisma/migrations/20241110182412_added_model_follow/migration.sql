/*
  Warnings:

  - You are about to drop the `_UserFollowedArtists` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserFollowedArtists" DROP CONSTRAINT "_UserFollowedArtists_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserFollowedArtists" DROP CONSTRAINT "_UserFollowedArtists_B_fkey";

-- DropTable
DROP TABLE "_UserFollowedArtists";

-- CreateTable
CREATE TABLE "Follow" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "artistId" INTEGER NOT NULL,
    "followedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Follow_userId_artistId_key" ON "Follow"("userId", "artistId");

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
