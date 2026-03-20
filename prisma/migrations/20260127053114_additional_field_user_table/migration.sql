-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'customer', 'provider');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'inactive');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "phone" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'customer',
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'active';
