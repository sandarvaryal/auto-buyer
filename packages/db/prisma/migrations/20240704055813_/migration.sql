/*
  Warnings:

  - You are about to drop the column `isVerified` on the `User` table. All the data in the column will be lost.
  - Added the required column `name` to the `ToBeVerified` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `ToBeVerified` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ToBeVerified" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isVerified";
