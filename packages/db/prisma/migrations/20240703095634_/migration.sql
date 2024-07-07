-- CreateTable
CREATE TABLE "DarazInstance" (
    "id" SERIAL NOT NULL,
    "addedDate" TIMESTAMP(3) NOT NULL,
    "progress" BOOLEAN NOT NULL,
    "darazAccountId" INTEGER,

    CONSTRAINT "DarazInstance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DarazInstance" ADD CONSTRAINT "DarazInstance_darazAccountId_fkey" FOREIGN KEY ("darazAccountId") REFERENCES "DarazAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
