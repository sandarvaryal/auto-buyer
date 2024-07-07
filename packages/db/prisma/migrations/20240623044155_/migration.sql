-- CreateTable
CREATE TABLE "ToBeVerified" (
    "email" TEXT NOT NULL,
    "verificationCode" TEXT NOT NULL,
    "verificationCodeExpireDate" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ToBeVerified_email_key" ON "ToBeVerified"("email");
