/*
  Warnings:

  - You are about to drop the column `phone_no` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mobile]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mobile` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_phone_no_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "phone_no",
ADD COLUMN     "mobile" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_mobile_key" ON "users"("mobile");
