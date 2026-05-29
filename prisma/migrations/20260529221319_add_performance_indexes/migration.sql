-- CreateIndex
CREATE INDEX "Recipe_createdAt_idx" ON "Recipe"("createdAt");

-- CreateIndex
CREATE INDEX "UserRecipe_userId_savedAt_idx" ON "UserRecipe"("userId", "savedAt");

-- CreateIndex
CREATE INDEX "UserRecipe_recipeId_idx" ON "UserRecipe"("recipeId");
