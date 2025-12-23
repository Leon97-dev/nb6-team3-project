-- CreateTable
CREATE TABLE "Uploads" (
    "id" SERIAL NOT NULL,
    "instance_id" TEXT NOT NULL,
    "upload_name" TEXT NOT NULL,
    "description" TEXT,
    "email" TEXT,
    "status" TEXT NOT NULL DEFAULT 'offline',
    "instance_password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Uploads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Uploads_instance_id_key" ON "Uploads"("instance_id");

-- CreateIndex
CREATE UNIQUE INDEX "Uploads_email_key" ON "Uploads"("email");
