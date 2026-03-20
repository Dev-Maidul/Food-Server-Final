/*
  Warnings:

  - Added the required column `cuisine` to the `Meal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mealType` to the `Meal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spiceLevel` to the `Meal` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('VEG', 'NON_VEG', 'VEGAN');

-- CreateEnum
CREATE TYPE "SpiceLevel" AS ENUM ('NONE', 'MILD', 'MEDIUM', 'HOT', 'EXTRA_HOT');

-- AlterTable
ALTER TABLE "Meal" ADD COLUMN     "cuisine" TEXT NOT NULL,
ADD COLUMN     "dietary" TEXT[],
ADD COLUMN     "mealType" "MealType" NOT NULL,
ADD COLUMN     "spiceLevel" "SpiceLevel" NOT NULL;
