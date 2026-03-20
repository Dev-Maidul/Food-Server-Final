/*
  Warnings:

  - The `mealType` column on the `Meal` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `spiceLevel` column on the `Meal` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Meal" ALTER COLUMN "ingredients" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "cuisine" DROP NOT NULL,
ALTER COLUMN "dietary" SET DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "mealType",
ADD COLUMN     "mealType" TEXT,
DROP COLUMN "spiceLevel",
ADD COLUMN     "spiceLevel" TEXT;

-- DropEnum
DROP TYPE "MealType";

-- DropEnum
DROP TYPE "SpiceLevel";
