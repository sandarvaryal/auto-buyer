/*
  Warnings:

  - A unique constraint covering the columns `[verificationCode]` on the table `ToBeVerified` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ToBeVerified_verificationCode_key" ON "ToBeVerified"("verificationCode");
