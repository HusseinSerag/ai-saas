-- CreateTable
CREATE TABLE "ApiUserLimit" (
    "id" STRING NOT NULL,
    "userID" STRING NOT NULL,
    "count" INT4 NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiUserLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiUserLimit_userID_key" ON "ApiUserLimit"("userID");
