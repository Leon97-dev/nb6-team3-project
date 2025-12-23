/*
  Warnings:

  - The values [CAR_INSPECTION,PRICE_NEGOTIATION,CONTRACT_DRAFT,CONTRACT_SUCCESSFUL,CONTRACT_FAILED] on the enum `ContractStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `companyId` on the `Contract` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ContractStatus_new" AS ENUM ('carInspection', 'priceNegotiation', 'contractDraft', 'contractSuccessful', 'contractFailed');
ALTER TABLE "public"."Contract" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Contract" ALTER COLUMN "status" TYPE "ContractStatus_new" USING ("status"::text::"ContractStatus_new");
ALTER TYPE "ContractStatus" RENAME TO "ContractStatus_old";
ALTER TYPE "ContractStatus_new" RENAME TO "ContractStatus";
DROP TYPE "public"."ContractStatus_old";
ALTER TABLE "Contract" ALTER COLUMN "status" SET DEFAULT 'carInspection';
COMMIT;

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_companyId_fkey";

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "companyId",
ALTER COLUMN "status" SET DEFAULT 'carInspection';
