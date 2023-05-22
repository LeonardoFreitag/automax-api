-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unity" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "photoFileName" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "photoSize" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productPrice" (
    "id" TEXT NOT NULL,
    "tableName" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "height" DECIMAL(65,30) NOT NULL,
    "heightUnity" TEXT NOT NULL,
    "width" DECIMAL(65,30) NOT NULL,
    "widthUnity" TEXT NOT NULL,
    "depth" DECIMAL(65,30) NOT NULL,
    "depthUnity" TEXT NOT NULL,
    "depthOpen" DECIMAL(65,30) NOT NULL,
    "depthOpenUnity" TEXT NOT NULL,
    "addtitionalPercentage" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "productPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productTissue" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "underConsultation" BOOLEAN NOT NULL,
    "inRestocked" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "productTissue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "productPrice" ADD CONSTRAINT "productPrice_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productTissue" ADD CONSTRAINT "productTissue_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
