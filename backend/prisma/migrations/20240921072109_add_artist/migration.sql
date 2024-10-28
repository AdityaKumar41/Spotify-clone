/*
  Warnings:

  - Added the required column `verified` to the `Artist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "verified" BOOLEAN NOT NULL;
