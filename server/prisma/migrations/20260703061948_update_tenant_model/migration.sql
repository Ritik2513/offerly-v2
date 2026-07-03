/*
  Warnings:

  - You are about to drop the column `name` on the `Tenant` table. All the data in the column will be lost.
  - Added the required column `companyName` to the `Tenant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "name",
ADD COLUMN     "companyName" TEXT NOT NULL;
