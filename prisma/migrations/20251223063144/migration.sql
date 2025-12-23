-- CreateTable
CREATE TABLE "DashBoard" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "DashBoard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DashBoard_userId_idx" ON "DashBoard"("userId");
