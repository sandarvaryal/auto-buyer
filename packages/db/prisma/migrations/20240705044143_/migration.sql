/*
  Warnings:

  - Added the required column `url` to the `DarazInstance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DarazInstance" ADD COLUMN     "url" TEXT NOT NULL;
