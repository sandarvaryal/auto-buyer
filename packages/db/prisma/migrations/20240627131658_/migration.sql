-- DropIndex
DROP INDEX "DarazAccount_email_key";

-- AlterTable
ALTER TABLE "DarazAccount" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "DarazAccount_pkey" PRIMARY KEY ("id");
