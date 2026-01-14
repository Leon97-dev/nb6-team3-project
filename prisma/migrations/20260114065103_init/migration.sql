-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "AgeGroup" AS ENUM ('TEEN_10', 'TWENTIES_20', 'THIRTIES_30', 'FORTIES_40', 'FIFTIES_50', 'SIXTIES_60', 'SEVENTIES_70', 'EIGHTIES_80');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('SEOUL', 'GYEONGGI', 'INCHEON', 'GANGWON', 'CHUNGBUK', 'CHUNGNAM', 'SEJONG', 'DAEJEON', 'JEONBUK', 'JEONNAM', 'GWANGJU', 'GYEONGBUK', 'GYEONGNAM', 'DAEGU', 'ULSAN', 'BUSAN', 'JEJU');

-- CreateEnum
CREATE TYPE "CarType" AS ENUM ('COMPACT', 'MID_SIZE', 'LARGE', 'SPORTS_CAR', 'SUV');

-- CreateEnum
CREATE TYPE "CarStatus" AS ENUM ('POSSESSION', 'CONTRACT_PROCEEDING', 'CONTRACT_COMPLETED');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('CAR_INSPECTION', 'PRICE_NEGOTIATION', 'CONTRACT_DRAFT', 'CONTRACT_SUCCESSFUL', 'CONTRACT_FAILED');

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "employeeNumber" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "imageUrl" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "companyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Car" (
    "id" SERIAL NOT NULL,
    "carNumber" TEXT NOT NULL,
    "status" "CarStatus" NOT NULL DEFAULT 'POSSESSION',
    "manufacturingYear" INTEGER NOT NULL,
    "mileage" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "accidentCount" INTEGER NOT NULL,
    "explanation" TEXT,
    "accidentDetails" TEXT,
    "companyId" INTEGER NOT NULL,
    "carModelId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarModel" (
    "id" SERIAL NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "type" "CarType" NOT NULL,

    CONSTRAINT "CarModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "ageGroup" "AgeGroup",
    "region" "Region",
    "email" TEXT,
    "memo" TEXT,
    "companyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" SERIAL NOT NULL,
    "status" "ContractStatus" NOT NULL DEFAULT 'CAR_INSPECTION',
    "contractName" TEXT,
    "contractPrice" INTEGER,
    "resolutionDate" TIMESTAMP(3),
    "companyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "carId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractMeeting" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "contractId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractMeeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetingAlarm" (
    "id" SERIAL NOT NULL,
    "alarmAt" TIMESTAMP(3) NOT NULL,
    "contractMeetingId" INTEGER NOT NULL,

    CONSTRAINT "MeetingAlarm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractDocument" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "contentType" TEXT NOT NULL,
    "contractId" INTEGER NOT NULL,
    "uploadedByUserId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContractDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_companyCode_key" ON "Company"("companyCode");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_companyId_employeeNumber_key" ON "User"("companyId", "employeeNumber");

-- CreateIndex
CREATE INDEX "Car_carModelId_idx" ON "Car"("carModelId");

-- CreateIndex
CREATE UNIQUE INDEX "Car_companyId_carNumber_key" ON "Car"("companyId", "carNumber");

-- CreateIndex
CREATE INDEX "CarModel_type_idx" ON "CarModel"("type");

-- CreateIndex
CREATE UNIQUE INDEX "CarModel_manufacturer_model_key" ON "CarModel"("manufacturer", "model");

-- CreateIndex
CREATE INDEX "Customer_companyId_name_idx" ON "Customer"("companyId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_companyId_email_key" ON "Customer"("companyId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_companyId_phoneNumber_key" ON "Customer"("companyId", "phoneNumber");

-- CreateIndex
CREATE INDEX "Contract_companyId_status_idx" ON "Contract"("companyId", "status");

-- CreateIndex
CREATE INDEX "Contract_companyId_customerId_idx" ON "Contract"("companyId", "customerId");

-- CreateIndex
CREATE INDEX "Contract_companyId_carId_idx" ON "Contract"("companyId", "carId");

-- CreateIndex
CREATE INDEX "Contract_companyId_userId_idx" ON "Contract"("companyId", "userId");

-- CreateIndex
CREATE INDEX "ContractMeeting_contractId_idx" ON "ContractMeeting"("contractId");

-- CreateIndex
CREATE INDEX "MeetingAlarm_contractMeetingId_idx" ON "MeetingAlarm"("contractMeetingId");

-- CreateIndex
CREATE INDEX "ContractDocument_contractId_idx" ON "ContractDocument"("contractId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "CarModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractMeeting" ADD CONSTRAINT "ContractMeeting_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingAlarm" ADD CONSTRAINT "MeetingAlarm_contractMeetingId_fkey" FOREIGN KEY ("contractMeetingId") REFERENCES "ContractMeeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractDocument" ADD CONSTRAINT "ContractDocument_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractDocument" ADD CONSTRAINT "ContractDocument_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
