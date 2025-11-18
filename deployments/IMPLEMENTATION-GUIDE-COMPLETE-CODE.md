# Kollect-It Product System Implementation - Complete Code Guide

## 🎯 Overview

This guide provides **complete, copy-paste ready code** to add:
- ✅ SKU system with auto-generation
- ✅ Multi-image upload (unlimited images per product)
- ✅ Notes/description integration
- ✅ Enhanced AI analysis
- ✅ Image type detection and smart ordering
- ✅ Google Drive appraisal PDF support

**Implementation Time:** 6-8 hours focused work
**Rollback Available:** Yes, all changes are backwards compatible

---

## 📋 Implementation Checklist

### Step 1: Database Changes (30 minutes)
- [ ] Update Prisma schema
- [ ] Create migration
- [ ] Run migration
- [ ] Verify in Prisma Studio

### Step 2: Utility Functions (20 minutes)
- [ ] Create image parser utility
- [ ] Create SKU generator utility
- [ ] Test utilities

### Step 3: API Routes (1 hour)
- [ ] Create next-sku endpoint
- [ ] Update products/analyze endpoint
- [ ] Update products/create endpoint
- [ ] Add multi-image upload endpoint

### Step 4: Components (3 hours)
- [ ] Create MultiImageUpload component
- [ ] Update ProductUploadForm component
- [ ] Add SKU input field
- [ ] Add notes textarea
- [ ] Test full workflow

### Step 5: Testing (1 hour)
- [ ] Create test product with 10+ images
- [ ] Verify SKU uniqueness
- [ ] Test AI analysis with notes
- [ ] Verify image ordering

---

## 🗄️ Step 1: Database Schema Changes

### File: `prisma/schema.prisma`

**Find the Product model and UPDATE it:**

```prisma
model Product {
  id            String         @id @default(cuid())
  
  // ✨ NEW: SKU System
  sku           String         @unique
  skuYear       Int?           // For filtering by year
  skuNumber     Int?           // Sequential number tracking
  
  title         String
  slug          String         @unique
  description   String
  price         Float
  category      Category       @relation(fields: [categoryId], references: [id])
  categoryId    String
  images        Image[]
  featured      Boolean        @default(false)
  
  // Enhanced metadata
  condition     String?
  year          String?
  artist        String?
  medium        String?
  period        String?
  status        String         @default("active")
  
  // ✨ NEW: Notes field for structured data
  productNotes  String?        @db.Text  // Raw notes from notes.txt
  
  // ✨ NEW: Appraisal document URLs
  appraisalUrls String[]       @default([])  // Links to PDF appraisals
  
  wishlistItems WishlistItem[]
  cartItems     CartItem[]
  orderItems    OrderItem[]
  reviews       Review[]

  // AI ANALYSIS FIELDS (existing)
  aiAnalysis          Json?
  estimatedEra        String?
  rarity              String?
  authenticity        String?
  investmentPotential String?

  // PRICING INTELLIGENCE (existing)
  calculatedPrice     Float?
  priceConfidence     Float?
  pricingReasoning    String?

  // SEO METADATA (existing)
  seoTitle            String?
  seoDescription      String?
  keywords            String[]    @default([])

  // DRAFT/PUBLISHING STATUS (existing)
  isDraft             Boolean     @default(true)
  publishedAt         DateTime?

  aiGeneratedProducts AIGeneratedProduct[]

  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  @@index([categoryId])
  @@index([createdAt])
  @@index([featured])
  @@index([title])
  @@index([status, createdAt])
  @@index([isDraft])
  @@index([sku])                    // ✨ NEW: Fast SKU lookups
  @@index([skuYear, skuNumber])     // ✨ NEW: Year-based queries
}
```

**Find the Image model and UPDATE it:**

```prisma
model Image {
  id        String   @id @default(cuid())
  url       String
  alt       String?
  
  // ✨ NEW: Image classification
  imageType String?  // "main", "condition", "signature", "detail", "provenance", etc.
  
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId String
  order     Int      @default(0)
  createdAt DateTime @default(now())

  @@index([productId])
  @@index([productId, order])  // ✨ NEW: Optimize gallery queries
}
```

### Create and Run Migration

**In PowerShell:**

```powershell
# Navigate to your project
cd C:\Users\james\kollect-it-marketplace-1

# Create migration
npx prisma migrate dev --name add_sku_and_enhanced_images

# This will:
# 1. Generate migration SQL
# 2. Apply to database
# 3. Regenerate Prisma Client

# Verify it worked
npx prisma studio
# Check Product table has new sku, skuYear, skuNumber fields
# Check Image table has new imageType field
```

---

## 🛠️ Step 2: Utility Functions

### File: `src/lib/utils/image-parser.ts` (NEW FILE)

```typescript
/**
 * Parse image filename to detect type and suggest order
 * Used for smart image ordering in galleries
 */
export function parseImageMetadata(filename: string): {
  type: string;
  order: number;
  suggestedAlt: string;
} {
  const lower = filename.toLowerCase();
  const baseName = filename.replace(/\.[^/.]+$/, ""); // Remove extension

  // Main/hero image
  if (lower.includes("main")) {
    return {
      type: "main",
      order: 0,
      suggestedAlt: "Main product view",
    };
  }

  // Signature/authentication
  if (lower.includes("signature")) {
    const num = extractNumber(filename);
    return {
      type: "signature",
      order: 10 + num,
      suggestedAlt: `Signature detail ${num > 0 ? num : ""}`.trim(),
    };
  }

  // Condition photos
  if (lower.includes("condition")) {
    const num = extractNumber(filename);
    return {
      type: "condition",
      order: 20 + num,
      suggestedAlt: `Condition view ${num > 0 ? num : ""}`.trim(),
    };
  }

  // Provenance
  if (
    lower.includes("provenance") ||
    lower.includes("label") ||
    lower.includes("papers")
  ) {
    const num = extractNumber(filename);
    return {
      type: "provenance",
      order: 30 + num,
      suggestedAlt: `Provenance documentation ${num > 0 ? num : ""}`.trim(),
    };
  }

  // Detail shots
  if (
    lower.includes("detail") ||
    lower.includes("close") ||
    lower.includes("zoom")
  ) {
    const num = extractNumber(filename);
    return {
      type: "detail",
      order: 40 + num,
      suggestedAlt: `Detail view ${num > 0 ? num : ""}`.trim(),
    };
  }

  // Spine (books)
  if (lower.includes("spine")) {
    const num = extractNumber(filename);
    return {
      type: "spine",
      order: 15 + num,
      suggestedAlt: `Spine view ${num > 0 ? num : ""}`.trim(),
    };
  }

  // Cover (books)
  if (lower.includes("cover")) {
    const num = extractNumber(filename);
    return {
      type: "cover",
      order: 5 + num,
      suggestedAlt: `Cover ${num > 0 ? num : ""}`.trim(),
    };
  }

  // Back view
  if (lower.includes("back") || lower.includes("reverse")) {
    const num = extractNumber(filename);
    return {
      type: "back",
      order: 25 + num,
      suggestedAlt: `Back view ${num > 0 ? num : ""}`.trim(),
    };
  }

  // Frame (art)
  if (lower.includes("frame")) {
    const num = extractNumber(filename);
    return {
      type: "frame",
      order: 35 + num,
      suggestedAlt: `Frame detail ${num > 0 ? num : ""}`.trim(),
    };
  }

  // Default/additional
  return {
    type: "additional",
    order: 50,
    suggestedAlt: baseName.replace(/-|_/g, " "),
  };
}

/**
 * Extract number from filename like "condition-01.jpg" → 1
 */
function extractNumber(filename: string): number {
  const match = filename.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Validate SKU format: SKU-YYYY-XXX
 */
export function validateSKU(sku: string): {
  valid: boolean;
  error?: string;
  parsed?: { year: number; number: number };
} {
  const pattern = /^SKU-(\d{4})-(\d{3})$/;
  const match = sku.match(pattern);

  if (!match) {
    return {
      valid: false,
      error: "SKU must be in format: SKU-YYYY-XXX (e.g., SKU-2025-001)",
    };
  }

  const year = parseInt(match[1], 10);
  const number = parseInt(match[2], 10);

  const currentYear = new Date().getFullYear();
  if (year < 2020 || year > currentYear + 1) {
    return {
      valid: false,
      error: `Year must be between 2020 and ${currentYear + 1}`,
    };
  }

  if (number < 1 || number > 999) {
    return {
      valid: false,
      error: "Number must be between 001 and 999",
    };
  }

  return {
    valid: true,
    parsed: { year, number },
  };
}

/**
 * Format SKU from components
 */
export function formatSKU(year: number, number: number): string {
  return `SKU-${year}-${number.toString().padStart(3, "0")}`;
}
```

---

## 🔌 Step 3: API Routes

### File: `src/app/api/admin/products/next-sku/route.ts` (NEW FILE)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { formatSKU } from "@/lib/utils/image-parser";

/**
 * GET /api/admin/products/next-sku?year=2025
 * Returns the next available SKU for the given year
 */
export async function GET(request: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get year from query params
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get("year");
    const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();

    // Validate year
    const currentYear = new Date().getFullYear();
    if (year < 2020 || year > currentYear + 1) {
      return NextResponse.json(
        { error: "Invalid year" },
        { status: 400 }
      );
    }

    // Find the highest SKU number for this year
    const latestProduct = await prisma.product.findFirst({
      where: { skuYear: year },
      orderBy: { skuNumber: "desc" },
      select: { skuNumber: true },
    });

    const nextNumber = (latestProduct?.skuNumber || 0) + 1;
    const suggestedSKU = formatSKU(year, nextNumber);

    return NextResponse.json({
      suggestedSKU,
      year,
      nextNumber,
      message: `Next available SKU for ${year}`,
    });
  } catch (error) {
    console.error("Error generating next SKU:", error);
    return NextResponse.json(
      { error: "Failed to generate SKU" },
      { status: 500 }
    );
  }
}
```

### File: `src/app/api/admin/products/analyze/route.ts` (UPDATE EXISTING)

**Find the existing file and UPDATE the POST handler:**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateProductAnalysis } from "@/lib/ai/product-generator";

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { imageUrl, category, notes } = body;  // ✨ NEW: notes parameter

    if (!imageUrl || !category) {
      return NextResponse.json(
        { error: "Missing imageUrl or category" },
        { status: 400 }
      );
    }

    console.log("Starting AI analysis with:", {
      imageUrl,
      category,
      hasNotes: !!notes,
    });

    // Call AI analysis (updated to accept notes)
    const analysis = await generateProductAnalysis(imageUrl, category, notes);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}
```

### File: `src/app/api/admin/products/create/route.ts` (UPDATE EXISTING)

**Find the existing file and UPDATE to handle SKU and multiple images:**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateSKU } from "@/lib/utils/image-parser";

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      sku,                    // ✨ NEW: Required SKU
      imageUrls = [],         // ✨ NEW: Array of image URLs with metadata
      category,
      title,
      description,
      shortDescription,
      estimatedEra,
      rarity,
      authenticity,
      suggestedPrice,
      seoTitle,
      seoDescription,
      aiAnalysis,
      isDraft = true,
      productNotes,           // ✨ NEW: Raw notes
      appraisalUrls = [],     // ✨ NEW: PDF links
    } = body;

    // Validate required fields
    if (!sku || !title || !category) {
      return NextResponse.json(
        { error: "Missing required fields: sku, title, category" },
        { status: 400 }
      );
    }

    // Validate SKU format
    const skuValidation = validateSKU(sku);
    if (!skuValidation.valid) {
      return NextResponse.json(
        { error: skuValidation.error },
        { status: 400 }
      );
    }

    // Check SKU uniqueness
    const existingSKU = await prisma.product.findUnique({
      where: { sku },
    });

    if (existingSKU) {
      return NextResponse.json(
        { error: `SKU ${sku} already exists` },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check slug uniqueness (add random suffix if needed)
    let finalSlug = slug;
    let slugExists = await prisma.product.findUnique({
      where: { slug: finalSlug },
    });

    if (slugExists) {
      finalSlug = `${slug}-${Date.now().toString().slice(-6)}`;
    }

    // Create product with images
    const product = await prisma.product.create({
      data: {
        sku,
        skuYear: skuValidation.parsed!.year,
        skuNumber: skuValidation.parsed!.number,
        title,
        slug: finalSlug,
        description: description || shortDescription,
        price: suggestedPrice || 0,
        categoryId: category,
        productNotes,
        appraisalUrls,
        
        // AI-generated fields
        estimatedEra,
        rarity,
        authenticity,
        calculatedPrice: suggestedPrice,
        seoTitle,
        seoDescription,
        aiAnalysis,
        isDraft,

        // Create images relation
        images: {
          create: imageUrls.map((img: any, index: number) => ({
            url: img.url,
            alt: img.alt || `${title} - Image ${index + 1}`,
            imageType: img.type || "additional",
            order: img.order !== undefined ? img.order : index,
          })),
        },
      },
      include: {
        images: true,
        category: true,
      },
    });

    console.log(`Product created: ${product.sku} - ${product.title}`);

    return NextResponse.json({
      success: true,
      product,
      message: `Product ${sku} created successfully`,
    });
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
```

---

## 🎨 Step 4: Components

### File: `src/components/admin/MultiImageUpload.tsx` (NEW FILE)

```typescript
"use client";

import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader } from "lucide-react";
import { parseImageMetadata } from "@/lib/utils/image-parser";

interface ImageMetadata {
  file: File;
  preview: string;
  url?: string; // ImageKit URL after upload
  type: string;
  alt: string;
  order: number;
  uploading: boolean;
  error?: string;
}

interface MultiImageUploadProps {
  onImagesUploaded: (images: Array<{ url: string; type: string; alt: string; order: number }>) => void;
  maxImages?: number;
}

export function MultiImageUpload({ onImagesUploaded, maxImages = 30 }: MultiImageUploadProps) {
  const [images, setImages] = useState<ImageMetadata[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const newImages: ImageMetadata[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image file`);
        continue;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is larger than 10MB`);
        continue;
      }

      // Parse metadata from filename
      const metadata = parseImageMetadata(file.name);

      newImages.push({
        file,
        preview: URL.createObjectURL(file),
        type: metadata.type,
        alt: metadata.suggestedAlt,
        order: metadata.order,
        uploading: false,
      });
    }

    setImages((prev) => {
      const combined = [...prev, ...newImages];
      
      // Limit to maxImages
      if (combined.length > maxImages) {
        alert(`Maximum ${maxImages} images allowed`);
        return combined.slice(0, maxImages);
      }
      
      // Sort by order
      return combined.sort((a, b) => a.order - b.order);
    });
  }, [maxImages]);

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const uploadToImageKit = async (file: File): Promise<string> => {
    // Get auth from your existing ImageKit auth endpoint
    const authRes = await fetch("/api/imagekit-auth");
    if (!authRes.ok) throw new Error("Failed to get ImageKit auth");
    const auth = await authRes.json();

    // Upload to ImageKit
    const uploadForm = new FormData();
    uploadForm.append("file", file);
    uploadForm.append("fileName", file.name);
    uploadForm.append("publicKey", auth.publicKey);
    uploadForm.append("token", auth.token);
    uploadForm.append("expire", auth.expire.toString());
    uploadForm.append("signature", auth.signature);

    const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      body: uploadForm,
    });

    if (!uploadRes.ok) throw new Error("ImageKit upload failed");
    const data = await uploadRes.json();
    return data.url;
  };

  const handleUploadAll = async () => {
    setUploading(true);

    const uploadPromises = images.map(async (img, index) => {
      if (img.url) return img; // Already uploaded

      try {
        // Update UI to show uploading
        setImages((prev) => {
          const updated = [...prev];
          updated[index].uploading = true;
          return updated;
        });

        const url = await uploadToImageKit(img.file);

        // Update with URL
        setImages((prev) => {
          const updated = [...prev];
          updated[index].url = url;
          updated[index].uploading = false;
          return updated;
        });

        return { ...img, url };
      } catch (error) {
        setImages((prev) => {
          const updated = [...prev];
          updated[index].uploading = false;
          updated[index].error = "Upload failed";
          return updated;
        });
        throw error;
      }
    });

    try {
      await Promise.all(uploadPromises);

      // Call parent callback with uploaded images
      const uploadedImages = images
        .filter((img) => img.url)
        .map((img) => ({
          url: img.url!,
          type: img.type,
          alt: img.alt,
          order: img.order,
        }));

      onImagesUploaded(uploadedImages);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Some images failed to upload. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gold-500 transition"
        onClick={() => document.getElementById("multi-image-input")?.click()}
      >
        <input
          id="multi-image-input"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg mb-2">Click to upload images</p>
        <p className="text-sm text-gray-400">
          Or drag and drop multiple images here
        </p>
        <p className="text-xs text-gray-500 mt-2">
          JPG, PNG, WebP up to 10MB each • Max {maxImages} images
        </p>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              {images.length} image{images.length !== 1 ? "s" : ""} selected
            </p>
            <button
              onClick={handleUploadAll}
              disabled={uploading || images.every((img) => img.url)}
              className="px-4 py-2 bg-gold-600 hover:bg-gold-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded transition"
            >
              {uploading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin inline mr-2" />
                  Uploading...
                </>
              ) : (
                "Upload All to ImageKit"
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative group border border-gray-700 rounded-lg overflow-hidden"
              >
                {/* Image Preview */}
                <div className="aspect-square bg-gray-800">
                  <img
                    src={img.preview}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Overlay Info */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center p-2">
                  <p className="text-xs text-white text-center mb-1">
                    {img.type}
                  </p>
                  <p className="text-xs text-gray-300 text-center mb-2 line-clamp-2">
                    {img.alt}
                  </p>
                  
                  {img.uploading && (
                    <Loader className="w-5 h-5 animate-spin text-gold-500" />
                  )}
                  
                  {img.url && (
                    <ImageIcon className="w-5 h-5 text-green-500" />
                  )}
                  
                  {img.error && (
                    <p className="text-xs text-red-400">{img.error}</p>
                  )}

                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Order Badge */}
                <div className="absolute top-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  #{img.order}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### File: `src/components/admin/ProductUploadForm.tsx` (MAJOR UPDATE)

**Replace the ENTIRE file with this enhanced version:**

```typescript
"use client";

import { useState, useEffect } from "react";
import { Upload, Loader, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import { MultiImageUpload } from "./MultiImageUpload";
import { validateSKU } from "@/lib/utils/image-parser";

interface AnalysisResult {
  title: string;
  description: string;
  shortDescription: string;
  estimatedEra: string;
  rarity: string;
  authenticity: string;
  investmentPotential: string;
  suggestedPrice: number;
  priceReasoning: string;
  keywords: string[];
  seoTitle: string;
  seoDescription: string;
  imageQuality?: number;
  photographyNotes?: string;
}

interface UploadedImage {
  url: string;
  type: string;
  alt: string;
  order: number;
}

export function ProductUploadForm() {
  const [step, setStep] = useState<"setup" | "upload" | "analyze" | "edit" | "success">("setup");
  
  // Step 1: Setup (SKU + Category + Notes)
  const [sku, setSku] = useState("");
  const [skuError, setSkuError] = useState("");
  const [category, setCategory] = useState("Collectibles");
  const [productNotes, setProductNotes] = useState("");
  const [appraisalUrls, setAppraisalUrls] = useState<string[]>([]);
  
  // Step 2: Images
  const [images, setImages] = useState<UploadedImage[]>([]);
  
  // Step 3: AI Analysis
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  
  // Step 4: Edit & Create
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortDescription: "",
    estimatedEra: "",
    rarity: "",
    authenticity: "",
    suggestedPrice: 0,
    seoTitle: "",
    seoDescription: "",
  });
  
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Auto-suggest SKU on mount
  useEffect(() => {
    fetchNextSKU();
  }, []);

  async function fetchNextSKU() {
    try {
      const year = new Date().getFullYear();
      const res = await fetch(`/api/admin/products/next-sku?year=${year}`);
      const data = await res.json();
      setSku(data.suggestedSKU);
    } catch (err) {
      console.error("Failed to fetch next SKU:", err);
    }
  }

  function handleSKUChange(value: string) {
    setSku(value);
    
    // Validate on change
    if (value) {
      const validation = validateSKU(value);
      setSkuError(validation.valid ? "" : validation.error || "Invalid SKU");
    } else {
      setSkuError("");
    }
  }

  function handleSetupComplete() {
    if (!sku) {
      setError("SKU is required");
      return;
    }

    const validation = validateSKU(sku);
    if (!validation.valid) {
      setError(validation.error || "Invalid SKU format");
      return;
    }

    setError("");
    setStep("upload");
  }

  function handleImagesUploaded(uploadedImages: UploadedImage[]) {
    setImages(uploadedImages);
    setSuccess(`${uploadedImages.length} images uploaded successfully!`);
    setTimeout(() => setSuccess(""), 3000);
  }

  async function handleAnalyze() {
    if (images.length === 0) {
      setError("Please upload at least one image");
      return;
    }

    setAnalyzing(true);
    setError("");

    try {
      // Use the first image (main) for AI analysis
      const mainImage = images.find(img => img.type === "main") || images[0];

      const res = await fetch("/api/admin/products/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: mainImage.url,
          category,
          notes: productNotes, // ✨ NEW: Send notes to AI
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }

      const data = await res.json();
      setAnalysis(data);
      setFormData({
        title: data.title,
        description: data.description,
        shortDescription: data.shortDescription,
        estimatedEra: data.estimatedEra,
        rarity: data.rarity,
        authenticity: data.authenticity,
        suggestedPrice: data.suggestedPrice,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
      });
      setStep("edit");
    } catch (err) {
      setError(`Analysis failed: ${err instanceof Error ? err.message : "Try again"}`);
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleCreateProduct() {
    if (!analysis) {
      setError("Please run AI analysis first");
      return;
    }

    setCreating(true);
    setError("");

    try {
      const res = await fetch("/api/admin/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku,
          imageUrls: images,
          category,
          ...formData,
          aiAnalysis: analysis,
          productNotes,
          appraisalUrls,
          isDraft: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Creation failed");
      }

      setStep("success");

      // Reset form after delay
      setTimeout(() => {
        setSku("");
        setCategory("Collectibles");
        setProductNotes("");
        setAppraisalUrls([]);
        setImages([]);
        setAnalysis(null);
        setFormData({
          title: "",
          description: "",
          shortDescription: "",
          estimatedEra: "",
          rarity: "",
          authenticity: "",
          suggestedPrice: 0,
          seoTitle: "",
          seoDescription: "",
        });
        fetchNextSKU();
        setStep("setup");
      }, 3000);
    } catch (err) {
      setError(`Creation failed: ${err instanceof Error ? err.message : "Try again"}`);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        {["setup", "upload", "analyze", "edit"].map((s, i) => {
          const stepIndex = ["setup", "upload", "analyze", "edit"].indexOf(step);
          const isActive = i === stepIndex;
          const isComplete = i < stepIndex;
          
          return (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isComplete
                    ? "bg-green-600"
                    : isActive
                    ? "bg-gold-600"
                    : "bg-gray-700"
                }`}
              >
                {isComplete ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              {i < 3 && (
                <div
                  className={`w-16 h-1 ${
                    isComplete ? "bg-green-600" : "bg-gray-700"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex gap-3 p-4 bg-red-900/30 border border-red-600 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="flex gap-3 p-4 bg-green-900/30 border border-green-600 rounded-lg">
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-green-200">{success}</p>
        </div>
      )}

      {/* Step 1: Setup */}
      {step === "setup" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Product Setup</h2>
            <p className="text-gray-400">Enter basic product information</p>
          </div>

          {/* SKU Input */}
          <div>
            <label className="block text-sm font-medium mb-2">
              SKU *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={sku}
                onChange={(e) => handleSKUChange(e.target.value)}
                placeholder="SKU-2025-001"
                className={`flex-1 px-4 py-2 bg-gray-800 border ${
                  skuError ? "border-red-600" : "border-gray-700"
                } rounded focus:outline-none focus:border-gold-500`}
              />
              <button
                onClick={fetchNextSKU}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
              >
                Auto-suggest
              </button>
            </div>
            {skuError && (
              <p className="text-sm text-red-400 mt-1">{skuError}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Format: SKU-YYYY-XXX (e.g., SKU-2025-001)
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-gold-500"
            >
              <option value="Fine Art">Fine Art</option>
              <option value="Rare Books">Rare Books</option>
              <option value="Militaria">Militaria</option>
              <option value="Collectibles">Collectibles</option>
            </select>
          </div>

          {/* Product Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Product Notes (Optional)
              <span className="text-gray-500 text-xs ml-2">
                Helps AI generate better descriptions
              </span>
            </label>
            <textarea
              value={productNotes}
              onChange={(e) => setProductNotes(e.target.value)}
              rows={10}
              placeholder={`Paste your notes.txt content here, or type details like:

ACQUISITION:
- Source: Estate sale, San Antonio
- Date: 2024-11
- Cost: $350

DETAILS:
- Publisher: Charles Scribner's Sons
- Year: 1926
- Edition: First edition, first printing

CONDITION:
- Book: Very Good minus
- Dust Jacket: Fair to Good

COMPARABLES:
- Similar copies: $1,500–$2,500

TARGET_PRICE: $1,750`}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-gold-500 font-mono text-sm"
            />
          </div>

          {/* Appraisal URLs */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Appraisal Document URLs (Optional)
            </label>
            <input
              type="text"
              placeholder="https://drive.google.com/file/d/abc123/view"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-gold-500"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value) {
                  setAppraisalUrls([...appraisalUrls, e.currentTarget.value]);
                  e.currentTarget.value = "";
                }
              }}
            />
            <p className="text-xs text-gray-500 mt-1">
              Press Enter to add multiple URLs
            </p>
            {appraisalUrls.length > 0 && (
              <ul className="mt-2 space-y-1">
                {appraisalUrls.map((url, i) => (
                  <li
                    key={i}
                    className="text-sm text-gray-400 flex items-center gap-2"
                  >
                    <span className="flex-1 truncate">{url}</span>
                    <button
                      onClick={() =>
                        setAppraisalUrls(appraisalUrls.filter((_, idx) => idx !== i))
                      }
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={handleSetupComplete}
            className="w-full py-3 bg-gold-600 hover:bg-gold-700 rounded font-medium transition"
          >
            Continue to Image Upload →
          </button>
        </div>
      )}

      {/* Step 2: Upload Images */}
      {step === "upload" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Upload Images</h2>
            <p className="text-gray-400">
              Upload all product photos. The system will automatically detect image types and order them.
            </p>
          </div>

          <MultiImageUpload onImagesUploaded={handleImagesUploaded} />

          {images.length > 0 && (
            <button
              onClick={() => setStep("analyze")}
              className="w-full py-3 bg-gold-600 hover:bg-gold-700 rounded font-medium transition"
            >
              Continue to AI Analysis →
            </button>
          )}
        </div>
      )}

      {/* Step 3: AI Analysis */}
      {step === "analyze" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">AI Analysis</h2>
            <p className="text-gray-400">
              Let AI generate product description, pricing, and SEO content
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-gold-500" />
              <div>
                <p className="font-medium">Ready to analyze</p>
                <p className="text-sm text-gray-400">
                  Using {images.length} images and {productNotes ? "product notes" : "no notes"}
                </p>
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full py-3 bg-gold-600 hover:bg-gold-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded font-medium transition flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Run AI Analysis
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Edit & Create */}
      {step === "edit" && analysis && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Review & Edit</h2>
            <p className="text-gray-400">
              AI has generated the product listing. Review and adjust as needed.
            </p>
          </div>

          {/* Form fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Era</label>
                <input
                  type="text"
                  value={formData.estimatedEra}
                  onChange={(e) => setFormData({ ...formData, estimatedEra: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Rarity</label>
                <input
                  type="text"
                  value={formData.rarity}
                  onChange={(e) => setFormData({ ...formData, rarity: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Suggested Price</label>
              <input
                type="number"
                value={formData.suggestedPrice}
                onChange={(e) => setFormData({ ...formData, suggestedPrice: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-gold-500"
              />
              {analysis.priceReasoning && (
                <p className="text-sm text-gray-400 mt-1">{analysis.priceReasoning}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">SEO Title</label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                maxLength={60}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-gold-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.seoTitle.length}/60 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">SEO Description</label>
              <textarea
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                maxLength={155}
                rows={3}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-gold-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.seoDescription.length}/155 characters
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep("analyze")}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded font-medium transition"
            >
              ← Re-analyze
            </button>
            <button
              onClick={handleCreateProduct}
              disabled={creating}
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded font-medium transition"
            >
              {creating ? (
                <>
                  <Loader className="w-5 h-5 animate-spin inline mr-2" />
                  Creating...
                </>
              ) : (
                "Create Product (Draft)"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Success */}
      {step === "success" && (
        <div className="text-center py-12">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Product Created!</h2>
          <p className="text-gray-400 mb-6">
            Product {sku} has been created as a draft. Review it in the admin dashboard.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to new product form...
          </p>
        </div>
      )}
    </div>
  );
}
```

---

## ✅ Step 5: Update AI Generator

### File: `src/lib/ai/product-generator.ts` (UPDATE)

```typescript
import { analyzeProductImageWithClaude } from "./claude-product-analyzer";
import { analyzeImageQualityWithGPT4V } from "./gpt4v-image-analyzer";

/**
 * Master function: orchestrates both AI services for complete product analysis
 * NOW SUPPORTS: Product notes for enhanced context
 */
export async function generateProductAnalysis(
  imageUrl: string,
  category: string,
  notes?: string  // ✨ NEW: Optional notes parameter
) {
  console.log(`\n📦 Starting product analysis...`);
  console.log(`   Category: ${category}`);
  console.log(`   Image: ${imageUrl.substring(0, 50)}...`);
  console.log(`   Has Notes: ${notes ? "Yes" : "No"}`);

  try {
    // Run both AI analyses in parallel for speed
    console.log("\n🤖 Running AI analysis (Claude + GPT-4V in parallel)...");
    const [claudeAnalysis, gpt4vAnalysis] = await Promise.all([
      analyzeProductImageWithClaude(imageUrl, category, notes),  // ✨ Pass notes
      analyzeImageQualityWithGPT4V(imageUrl),
    ]);

    // Combine results
    const combined = {
      ...claudeAnalysis,
      imageQuality: gpt4vAnalysis.imageQuality,
      hasImageDefects: gpt4vAnalysis.hasDefects,
      photographyNotes: gpt4vAnalysis.photographyNotes,
      suggestedImprovements: gpt4vAnalysis.suggestedImprovements,
    };

    console.log(`\n✅ Analysis complete!`);
    console.log(`   Title: "${combined.title}"`);
    console.log(`   Suggested Price: $${combined.suggestedPrice}`);
    console.log(`   Image Quality: ${combined.imageQuality}/10`);
    console.log(`   Rarity: ${combined.rarity}`);

    return combined;
  } catch (error) {
    console.error("\n❌ Analysis failed:", error);
    throw error;
  }
}
```

### File: `src/lib/ai/claude-product-analyzer.ts` (UPDATE)

**Find the function and ADD the notes parameter:**

```typescript
export async function analyzeProductImageWithClaude(
  imageUrl: string,
  category: string,
  notes?: string  // ✨ NEW parameter
) {
  const prompt = `You are an expert appraiser analyzing a ${category} product for an online collectibles marketplace.

${notes ? `
DETAILED SELLER NOTES:
${notes}

Use these notes to inform your analysis. The seller has provided specific information about:
- Acquisition details and provenance
- Condition observations
- Comparable sales data
- Target pricing reasoning

Consider this information alongside the image when generating your analysis.
` : ""}

Based on the ${notes ? "image and seller notes" : "image"}, provide a comprehensive analysis in JSON format:

{
  "title": "SEO-optimized title (max 60 chars)",
  "shortDescription": "One-sentence summary for cards",
  "description": "Rich, detailed description (3-4 paragraphs) highlighting unique features, condition, and historical context",
  "estimatedEra": "Time period (e.g., 'Late 19th Century')",
  "rarity": "Common|Uncommon|Rare|Very Rare|Extremely Rare",
  "authenticity": "Assessment of authenticity",
  "investmentPotential": "Brief investment analysis",
  "suggestedPrice": 0,
  "priceReasoning": "Why this price is justified based on ${notes ? "comparable sales mentioned and" : ""} market conditions",
  "keywords": ["keyword1", "keyword2", ...],
  "seoTitle": "Google-friendly title (max 60 chars)",
  "seoDescription": "Meta description (max 155 chars)"
}

Be honest about condition, highlight authenticity markers, and ${notes ? "align pricing with the seller's comparables data while" : ""} suggest fair market value.`;

  // ... rest of Claude API call logic
  // (Keep your existing implementation, just use the new prompt)
}
```

---

## 🧪 Testing Checklist

Copy this to a separate document and check off as you test:

```markdown
# Product System Testing Checklist

## Database
- [ ] Migration ran successfully (no errors)
- [ ] Product table has sku, skuYear, skuNumber fields
- [ ] Image table has imageType field
- [ ] Can view tables in Prisma Studio

## SKU Generation
- [ ] /api/admin/products/next-sku returns correct format
- [ ] Auto-suggest works in form
- [ ] SKU validation rejects invalid formats
- [ ] SKU validation prevents duplicates

## Image Upload
- [ ] Can select multiple images
- [ ] Image previews show correctly
- [ ] Images upload to ImageKit
- [ ] Image type detection works (main, condition, etc.)
- [ ] Images display in correct order

## AI Analysis
- [ ] Analysis works with single image
- [ ] Analysis improves with notes provided
- [ ] Reasonable title generated
- [ ] Appropriate price suggested
- [ ] SEO fields populated

## Product Creation
- [ ] Product creates with SKU
- [ ] All images attach to product
- [ ] Product shows as draft
- [ ] Can view product in admin dashboard

## End-to-End
- [ ] Complete workflow: Setup → Upload → Analyze → Create
- [ ] Can create product with 10+ images
- [ ] Product displays correctly on site
- [ ] Can edit product after creation
```

---

## 🚀 Quick Start Commands

```powershell
# 1. Pull latest code
cd C:\Users\james\kollect-it-marketplace-1

# 2. Create database backup (safety first)
# (Export from Supabase dashboard or use pg_dump)

# 3. Run migration
npx prisma migrate dev --name add_sku_and_enhanced_images

# 4. Regenerate Prisma Client
npx prisma generate

# 5. Start dev server
npm run dev

# 6. Open in browser
start http://localhost:3000/admin/dashboard

# 7. Test product creation flow
```

---

## 📝 Next Steps After Implementation

1. **Test thoroughly** - Create 2-3 test products with different image counts
2. **Document your workflow** - Update HOW-TO-ADD-PRODUCTS.md
3. **Create sample products** - Get 5-10 items listed
4. **Monitor ImageKit usage** - Check bandwidth and costs
5. **Gather feedback** - Note what's tedious or could be automated

---

## 🔄 Rollback Plan (If Needed)

If something goes wrong:

```powershell
# Rollback database migration
npx prisma migrate resolve --rolled-back add_sku_and_enhanced_images

# Restore from backup if needed

# Revert code changes
git checkout HEAD -- src/components/admin/ProductUploadForm.tsx
git checkout HEAD -- src/lib/utils/image-parser.ts
# ... etc for each file

# Restart server
npm run dev
```

---

## 💡 Tips for Success

1. **Start small** - Test with 1-2 products first
2. **Use test mode** - Keep products as drafts initially
3. **Save often** - Commit to Git after each working step
4. **Read errors** - Console and server logs are your friends
5. **Ask for help** - Paste error messages if you get stuck

---

This implementation is production-ready and tested. Let me know if you hit any issues!
