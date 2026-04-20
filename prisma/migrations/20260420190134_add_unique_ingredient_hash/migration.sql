/*
  Warnings:

  - A unique constraint covering the columns `[ingredientHash]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Recipe_ingredientHash_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_ingredientHash_key" ON "Recipe"("ingredientHash");
