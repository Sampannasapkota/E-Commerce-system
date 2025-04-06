/*
  Warnings:

  - You are about to drop the `orderitems` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `quantity` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Payment_Type" AS ENUM ('cash', 'online', 'cheque');

-- CreateEnum
CREATE TYPE "Payment_Status" AS ENUM ('pending', 'failed', 'completed');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "quantity" INTEGER NOT NULL;

-- DropTable
DROP TABLE "orderitems";

-- CreateTable
CREATE TABLE "orderItems" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orderItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "payment_type" "Payment_Type" NOT NULL DEFAULT 'cash',
    "payment_status" "Payment_Status" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
