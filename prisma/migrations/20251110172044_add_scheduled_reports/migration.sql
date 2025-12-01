-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "aiAnalysis" JSONB,
ADD COLUMN     "authenticity" TEXT,
ADD COLUMN     "calculatedPrice" DOUBLE PRECISION,
ADD COLUMN     "estimatedEra" TEXT,
ADD COLUMN     "investmentPotential" TEXT,
ADD COLUMN     "isDraft" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "priceConfidence" DOUBLE PRECISION,
ADD COLUMN     "pricingReasoning" TEXT,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "rarity" TEXT,
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoTitle" TEXT;

-- CreateTable
CREATE TABLE "AIGeneratedProduct" (
    "id" TEXT NOT NULL,
    "googleDriveId" TEXT,
    "imageUrl" TEXT,
    "aiTitle" VARCHAR(500) NOT NULL,
    "aiDescription" TEXT NOT NULL,
    "aiCategory" TEXT NOT NULL,
    "aiCondition" TEXT NOT NULL DEFAULT 'GOOD',
    "aiEstimatedAge" TEXT,
    "aiRarity" TEXT,
    "imageQualityScore" DOUBLE PRECISION,
    "authenticityScore" DOUBLE PRECISION,
    "imageAnalysis" JSONB,
    "suggestedPrice" DOUBLE PRECISION NOT NULL,
    "priceLowRange" DOUBLE PRECISION NOT NULL,
    "priceHighRange" DOUBLE PRECISION NOT NULL,
    "priceConfidence" DOUBLE PRECISION NOT NULL,
    "pricingAnalysis" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "productId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIGeneratedProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "format" TEXT NOT NULL DEFAULT 'JSON',
    "recipients" TEXT NOT NULL,
    "lastSent" TIMESTAMP(3),
    "nextScheduled" TIMESTAMP(3) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportAuditLog" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "recipients" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "error" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AIGeneratedProduct_status_idx" ON "AIGeneratedProduct"("status");

-- CreateIndex
CREATE INDEX "AIGeneratedProduct_createdAt_idx" ON "AIGeneratedProduct"("createdAt");

-- CreateIndex
CREATE INDEX "AIGeneratedProduct_reviewedBy_idx" ON "AIGeneratedProduct"("reviewedBy");

-- CreateIndex
CREATE INDEX "AIGeneratedProduct_productId_idx" ON "AIGeneratedProduct"("productId");

-- CreateIndex
CREATE INDEX "AIGeneratedProduct_status_createdAt_idx" ON "AIGeneratedProduct"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ScheduledReport_userId_idx" ON "ScheduledReport"("userId");

-- CreateIndex
CREATE INDEX "ScheduledReport_nextScheduled_idx" ON "ScheduledReport"("nextScheduled");

-- CreateIndex
CREATE INDEX "ScheduledReport_enabled_idx" ON "ScheduledReport"("enabled");

-- CreateIndex
CREATE INDEX "ScheduledReport_frequency_idx" ON "ScheduledReport"("frequency");

-- CreateIndex
CREATE INDEX "ReportAuditLog_reportId_idx" ON "ReportAuditLog"("reportId");

-- CreateIndex
CREATE INDEX "ReportAuditLog_sentAt_idx" ON "ReportAuditLog"("sentAt");

-- CreateIndex
CREATE INDEX "ReportAuditLog_status_idx" ON "ReportAuditLog"("status");

-- CreateIndex
CREATE INDEX "Product_title_idx" ON "Product"("title");

-- CreateIndex
CREATE INDEX "Product_status_createdAt_idx" ON "Product"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Product_isDraft_idx" ON "Product"("isDraft");

-- AddForeignKey
ALTER TABLE "AIGeneratedProduct" ADD CONSTRAINT "AIGeneratedProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledReport" ADD CONSTRAINT "ScheduledReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportAuditLog" ADD CONSTRAINT "ReportAuditLog_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "ScheduledReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
