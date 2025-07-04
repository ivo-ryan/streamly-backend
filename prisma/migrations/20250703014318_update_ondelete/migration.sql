-- DropForeignKey
ALTER TABLE "Series" DROP CONSTRAINT "Series_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "Series" ADD CONSTRAINT "Series_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
