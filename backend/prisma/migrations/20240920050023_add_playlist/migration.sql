-- CreateTable
CREATE TABLE "playlist" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "discription" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SongToplaylist" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SongToplaylist_AB_unique" ON "_SongToplaylist"("A", "B");

-- CreateIndex
CREATE INDEX "_SongToplaylist_B_index" ON "_SongToplaylist"("B");

-- AddForeignKey
ALTER TABLE "playlist" ADD CONSTRAINT "playlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SongToplaylist" ADD CONSTRAINT "_SongToplaylist_A_fkey" FOREIGN KEY ("A") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SongToplaylist" ADD CONSTRAINT "_SongToplaylist_B_fkey" FOREIGN KEY ("B") REFERENCES "playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
