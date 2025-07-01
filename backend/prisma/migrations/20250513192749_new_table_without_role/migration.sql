/*
  Warnings:

  - You are about to drop the column `role_id` on the `sellers` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `shop_name` to the `sellers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Shop_Type" AS ENUM ('wholesale', 'retail');

-- DropForeignKey
ALTER TABLE "sellers" DROP CONSTRAINT "sellers_role_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_role_id_fkey";

-- AlterTable
ALTER TABLE "sellers" DROP COLUMN "role_id",
ADD COLUMN     "shop_name" TEXT NOT NULL,
ADD COLUMN     "shop_type" "Shop_Type" NOT NULL DEFAULT 'wholesale';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role_id";

-- DropTable
DROP TABLE "roles";
