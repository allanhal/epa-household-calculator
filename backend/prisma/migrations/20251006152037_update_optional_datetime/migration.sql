/*
  Warnings:

  - Made the column `lastCalculated` on table `Household` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalEmissions` on table `Household` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Household" ALTER COLUMN "lastCalculated" SET NOT NULL,
ALTER COLUMN "lastCalculated" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "totalEmissions" SET NOT NULL;
