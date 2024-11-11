/*
  Warnings:

  - You are about to drop the `portfolio` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "portfolio" DROP CONSTRAINT "fk_user";

-- DropTable
DROP TABLE "portfolio";

-- CreateTable
CREATE TABLE "portofolio" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "project_name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "start_date" DATE,
    "end_date" DATE,
    "status" VARCHAR(50),
    "budget" DECIMAL(15,2),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portofolio_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "portofolio" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
