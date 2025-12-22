"use client";

import { useState, useEffect } from "react";
import { Loader, AlertCircle, CheckCircle2, Sparkles, Copy } from "lucide-react";
import MultiImageUpload from "./MultiImageUpload";
import SingleDocumentUpload from "./SingleDocumentUpload";
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
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [categories, setCategories] = useState<Array<{id: string; name: string; subcategories: Array<{id: string; name: string}>}>>([]);
  const [productNotes, setProductNotes] = useState("");
  const [appraisalUrls, setAppraisalUrls] = useState<string[]>([]);
  const [newAppraisalUrl, setNewAppraisalUrl] = useState("");

  // Step 2: Images
  const [images, setImages] = useState<UploadedImage[]>([]);

  // Step 2.5: Documents (Optional)
  const [provenanceDocUrl, setProvenanceDocUrl] = useState<string | null>(null);
  const [appraisalDocUrl, setAppraisalDocUrl] = useState<string | null>(null);

  // Step 3: AI Analysis
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  // Step 4: Edit & Create
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Form state for editing AI suggestions
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

  // Auto-suggest SKU on mount and fetch categories
  useEffect(() => {
    fetchNextSKU();
    fetchCategories();
  }, []);

  // Reset unsaved changes when step changes
  useEffect(() => {
    if (step !== "edit") {
      setHasUnsavedChanges(false);
      setLastSaved(null);
    }
  }, [step]);

  async function fetchCategories() {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const cats = await res.json();
        setCategories(cats);
        if (cats.length > 0) {
          const collectibles = cats.find((c: any) => c.name === "Collectibles") || cats[0];
          setCategory(collectibles.name);
          setCategoryId(collectibles.id);
          setSubcategoryId(collectibles.subcategories?.[0]?.id || "");
        }
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  }

  async function fetchNextSKU() {
    try {
      const year = new Date().getFullYear();
      const res = await fetch(`/api/admin/products/next-sku?year=${year}`);
      if (!res.ok) throw new Error("Failed to fetch SKU");
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

  function handleAddAppraisalUrl() {
    if (newAppraisalUrl.trim()) {
      setAppraisalUrls([...appraisalUrls, newAppraisalUrl]);
      setNewAppraisalUrl("");
    }
  }

  function handleRemoveAppraisalUrl(index: number) {
    setAppraisalUrls(appraisalUrls.filter((_, i) => i !== index));
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
      // Mark as ready to edit (no unsaved changes initially)
      setHasUnsavedChanges(false);
    } catch (err) {
      setError(`Analysis failed: ${err instanceof Error ? err.message : "Try again"}`);
    } finally {
      setAnalyzing(false);
    }
  }

  function handleCopyAllProductInfo() {
    const selectedCategory = categories.find(c => c.id === categoryId);
    const selectedSubcategory = selectedCategory?.subcategories?.find(s => s.id === subcategoryId);

    const productInfo = `PRODUCT INFORMATION - ${sku}
===============================

SKU: ${sku}
Category: ${selectedCategory?.name || category}
Subcategory: ${selectedSubcategory?.name || "N/A"}

TITLE: ${formData.title || ""}

DESCRIPTION:
${formData.description || ""}

ERA: ${formData.estimatedEra || ""}
RARITY: ${formData.rarity || ""}
AUTHENTICITY: ${formData.authenticity || ""}
SUGGESTED PRICE: $${formData.suggestedPrice.toFixed(2) || "0.00"}

SEO TITLE: ${formData.seoTitle || ""}

SEO DESCRIPTION:
${formData.seoDescription || ""}

${productNotes ? `PRODUCT NOTES:\n${productNotes}\n` : ""}
${appraisalUrls.length > 0 ? `APPRAISAL URLS:\n${appraisalUrls.join("\n")}\n` : ""}
${images.length > 0 ? `IMAGES: ${images.length} image(s) uploaded\n` : ""}`;

    navigator.clipboard.writeText(productInfo).then(() => {
      setSuccess("All product information copied to clipboard!");
      setTimeout(() => setSuccess(""), 3000);
    }).catch((err) => {
      setError("Failed to copy to clipboard. Please select and copy manually.");
      console.error("Copy failed:", err);
    });
  }

  async function handleCreateProduct(isDraft: boolean = true) {
    if (!analysis) {
      setError("Please run AI analysis first");
      return;
    }

    // Validate required fields
    if (!formData.title || formData.title.trim().length === 0) {
      setError("Product title is required");
      return;
    }

    if (!formData.suggestedPrice || formData.suggestedPrice <= 0) {
      setError("Product price must be greater than 0");
      return;
    }

    if (images.length === 0) {
      setError("At least one image is required");
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
          categoryId,
          subcategoryId: subcategoryId || undefined,
          ...formData,
          aiAnalysis: analysis,
          productNotes,
          appraisalUrls,
          appraisalDocUrl: appraisalDocUrl || undefined,
          provenanceDocUrl: provenanceDocUrl || undefined,
          isDraft,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Creation failed");
      }

      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      setStep("success");

      // Reset form after delay
      setTimeout(() => {
        setSku("");
        const collectibles = categories.find(c => c.name === "Collectibles") || categories[0];
        setCategory(collectibles?.name || "Collectibles");
        setCategoryId(collectibles?.id || "");
        setSubcategoryId(collectibles?.subcategories?.[0]?.id || "");
        setProductNotes("");
        setAppraisalUrls([]);
        setImages([]);
        setProvenanceDocUrl(null);
        setAppraisalDocUrl(null);
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
                    ? "bg-lux-gold"
                    : "bg-lux-charcoal"
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
                    isComplete ? "bg-green-600" : "bg-lux-charcoal"
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
            <p className="text-ink-600">Enter basic product information</p>
          </div>

          {/* SKU Input */}
          <div>
            <label htmlFor="product-sku" className="block text-sm font-medium mb-2">
              SKU *
            </label>
            <div className="flex gap-2">
              <input
                id="product-sku"
                type="text"
                value={sku}
                onChange={(e) => handleSKUChange(e.target.value)}
                placeholder="SKU-2025-001"
                className={`flex-1 px-4 py-2 bg-lux-charcoal border ${
                  skuError ? "border-red-600" : "border-lux-charcoal/50"
                } rounded focus:outline-none focus:border-lux-gold focus:ring-2 focus:ring-lux-gold text-lux-cream placeholder:text-lux-gray-dark`}
                aria-label="Product SKU"
              />
              <button
                onClick={fetchNextSKU}
                className="px-4 py-2 bg-lux-charcoal/80 hover:bg-lux-charcoal rounded transition text-lux-cream"
              >
                Auto-suggest
              </button>
            </div>
            {skuError && (
              <p className="text-sm text-red-400 mt-1">{skuError}</p>
            )}
            <p className="text-xs text-ink-700 mt-1">
              Format: SKU-YYYY-XXX (e.g., SKU-2025-001)
            </p>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category-select" className="block text-sm font-medium mb-2">
              Category *
            </label>
            <select
              id="category-select"
              value={categoryId}
              onChange={(e) => {
                const selectedCat = categories.find(c => c.id === e.target.value);
                setCategory(selectedCat?.name || "");
                setCategoryId(e.target.value);
                setSubcategoryId(selectedCat?.subcategories?.[0]?.id || "");
              }}
              className="w-full px-4 py-2 bg-lux-charcoal border border-lux-charcoal/50 rounded focus:outline-none focus:border-lux-gold focus:ring-2 focus:ring-lux-gold text-lux-cream"
              aria-label="Select product category"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
          <div>
            <label htmlFor="subcategory-select" className="block text-sm font-medium mb-2">
              Subcategory (Optional)
            </label>
            <select
              id="subcategory-select"
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value)}
              aria-label="Select product subcategory"
              className="w-full px-4 py-2 bg-lux-charcoal border border-lux-charcoal/50 rounded focus:outline-none focus:border-lux-gold focus:ring-2 focus:ring-lux-gold text-lux-cream"
              disabled={!categoryId}
            >
              <option value="">Select Subcategory (Optional)</option>
              {categories
                .find((c) => c.id === categoryId)
                ?.subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Product Notes */}
          <div>
            <label htmlFor="product-notes" className="block text-sm font-medium mb-2">
              Product Notes (Optional)
              <span className="text-ink-700 text-xs ml-2">
                Helps AI generate better descriptions
              </span>
            </label>
            <textarea
              id="product-notes"
              value={productNotes}
              onChange={(e) => setProductNotes(e.target.value)}
              rows={10}
              aria-label="Product notes for AI analysis"
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
              className="w-full px-4 py-2 bg-lux-charcoal border border-lux-charcoal/50 rounded focus:outline-none focus:border-lux-gold focus:ring-2 focus:ring-lux-gold font-mono text-sm text-lux-cream placeholder:text-lux-gray-dark"
            />
          </div>

          {/* Appraisal URLs */}
          <div>
            <label htmlFor="appraisal-url" className="block text-sm font-medium mb-2">
              Appraisal Document URLs (Optional)
            </label>
            <div className="flex gap-2">
              <input
                id="appraisal-url"
                type="text"
                value={newAppraisalUrl}
                onChange={(e) => setNewAppraisalUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/abc123/view"
                aria-label="Appraisal document URL"
                className="flex-1 px-4 py-2 bg-lux-charcoal border border-lux-charcoal/50 rounded focus:outline-none focus:border-lux-gold focus:ring-2 focus:ring-lux-gold text-lux-cream placeholder:text-lux-gray-dark"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddAppraisalUrl();
                  }
                }}
              />
              <button
                onClick={handleAddAppraisalUrl}
                className="px-4 py-2 bg-lux-charcoal/80 hover:bg-lux-charcoal rounded transition text-lux-cream"
              >
                Add
              </button>
            </div>
            <p className="text-xs text-ink-700 mt-1">
              Press Enter or click Add to add multiple URLs
            </p>
            {appraisalUrls.length > 0 && (
              <ul className="mt-2 space-y-1">
                {appraisalUrls.map((url, i) => (
                  <li
                    key={i}
                    className="text-sm text-lux-gray flex items-center gap-2"
                  >
                    <span className="flex-1 truncate">{url}</span>
                    <button
                      onClick={() => handleRemoveAppraisalUrl(i)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={handleSetupComplete}
            className="w-full py-3 bg-lux-gold hover:bg-lux-gold-light rounded-full font-medium transition text-lux-black"
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
            <p className="text-ink-600">
              Upload all product photos. The system will automatically detect image types and order them.
            </p>
          </div>

          <MultiImageUpload 
            onImagesUploaded={handleImagesUploaded}
            sku={sku}
            productTitle={formData.title}
          />

          {/* Documentation Section (Optional) */}
          <div className="mt-8 pt-8 border-t border-lux-charcoal/30">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-lux-cream">Documentation (Optional)</h3>
              <p className="text-sm text-lux-gray-dark mb-4">
                Upload provenance certificates or appraisal documents to support product authenticity.
              </p>
            </div>

            <div className="space-y-4">
              <SingleDocumentUpload
                label="Provenance Document"
                value={provenanceDocUrl}
                onChange={setProvenanceDocUrl}
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                maxSizeMB={10}
              />

              <SingleDocumentUpload
                label="Third-Party Appraisal"
                value={appraisalDocUrl}
                onChange={setAppraisalDocUrl}
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                maxSizeMB={10}
              />
            </div>
          </div>

          {images.length > 0 && (
            <button
              onClick={() => setStep("analyze")}
              className="w-full py-3 bg-lux-gold hover:bg-lux-gold-light rounded-full font-medium transition text-lux-black"
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
            <p className="text-ink-600">
              Let AI generate product description, pricing, and SEO content
            </p>
          </div>

          <div className="bg-lux-charcoal p-6 rounded-xl border border-lux-charcoal/50">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-lux-gold" />
              <div>
                <p className="font-medium text-lux-cream">Ready to analyze</p>
                <p className="text-sm text-lux-gray-dark">
                  Using {images.length} images and {productNotes ? "product notes" : "no notes"}
                </p>
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full py-3 bg-lux-gold hover:bg-lux-gold-light disabled:bg-lux-charcoal/50 disabled:cursor-not-allowed rounded-full font-medium transition flex items-center justify-center gap-2 text-lux-black"
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
            <p className="text-ink-600">
              AI has generated the product listing. Review and adjust as needed.
            </p>
          </div>

          {/* Form fields */}
          <div className="space-y-4">
            <div>
              <label htmlFor="product-title" className="block text-sm font-medium mb-2">
                Title *
                {formData.title.length > 0 && (
                  <span className="text-xs text-lux-gray-dark ml-2">
                    ({formData.title.length} characters)
                  </span>
                )}
              </label>
              <input
                id="product-title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 bg-lux-charcoal border border-lux-charcoal/50 rounded focus:outline-none focus:border-lux-gold focus:ring-2 focus:ring-lux-gold text-lux-cream"
                aria-label="Product title"
                aria-required="true"
              />
              {formData.title.length === 0 && (
                <p className="text-xs text-red-400 mt-1">Title is required</p>
              )}
            </div>

            <div>
              <label htmlFor="product-description" className="block text-sm font-medium mb-2">Description</label>
              <textarea
                id="product-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 bg-lux-charcoal border border-lux-charcoal/50 rounded focus:outline-none focus:border-lux-gold focus:ring-2 focus:ring-lux-gold text-lux-cream"
                aria-label="Product description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="product-era" className="block text-sm font-medium mb-2">Era</label>
                <input
                  id="product-era"
                  type="text"
                  value={formData.estimatedEra}
                  onChange={(e) => setFormData({ ...formData, estimatedEra: e.target.value })}
                  className="w-full px-4 py-2 bg-lux-charcoal border border-lux-charcoal/50 rounded focus:outline-none focus:border-lux-gold focus:ring-2 focus:ring-lux-gold text-lux-cream"
                  aria-label="Product estimated era"
                />
              </div>

              <div>
                <label htmlFor="product-rarity" className="block text-sm font-medium mb-2">Rarity</label>
                <input
                  id="product-rarity"
                  type="text"
                  value={formData.rarity}
                  onChange={(e) => setFormData({ ...formData, rarity: e.target.value })}
                  className="w-full px-4 py-2 bg-lux-charcoal border border-lux-charcoal/50 rounded focus:outline-none focus:border-lux-gold focus:ring-2 focus:ring-lux-gold text-lux-cream"
                  aria-label="Product rarity"
                />
              </div>
            </div>

            <div>
              <label htmlFor="product-price" className="block text-sm font-medium mb-2">
                Suggested Price *
                {formData.suggestedPrice > 0 && (
                  <span className="text-xs text-lux-gray-dark ml-2">
                    ${formData.suggestedPrice.toFixed(2)}
                  </span>
                )}
              </label>
              <input
                id="product-price"
                type="number"
                min="0"
                step="0.01"
                value={formData.suggestedPrice || ''}
                onChange={(e) => setFormData({ ...formData, suggestedPrice: parseFloat(e.target.value) || 0 })}
                required
                className="w-full px-4 py-2 bg-lux-charcoal border border-lux-charcoal/50 rounded focus:outline-none focus:border-lux-gold focus:ring-2 focus:ring-lux-gold text-lux-cream"
                aria-label="Suggested product price"
                aria-required="true"
              />
              {analysis.priceReasoning && (
                <p className="text-sm text-lux-gray-dark mt-1">{analysis.priceReasoning}</p>
              )}
              {formData.suggestedPrice <= 0 && (
                <p className="text-xs text-red-400 mt-1">Price must be greater than 0</p>
              )}
            </div>

            <div>
              <label htmlFor="seo-title" className="block text-sm font-medium mb-2">
                SEO Title
                <span className="text-xs text-lux-gray-dark ml-2">(Optional - auto-generated if empty)</span>
              </label>
              <input
                id="seo-title"
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                maxLength={60}
                placeholder="Auto-generated from product title"
                className="w-full px-4 py-2 bg-lux-charcoal border border-lux-charcoal/50 rounded focus:outline-none focus:border-lux-gold focus:ring-2 focus:ring-lux-gold text-lux-cream placeholder:text-lux-gray-dark"
                aria-label="SEO title for product (optimal: 50-60 characters)"
              />
              <p className={`text-xs mt-1 ${formData.seoTitle.length > 60 ? 'text-red-400' : formData.seoTitle.length > 50 ? 'text-lux-gold' : 'text-ink-700'}`}>
                {formData.seoTitle.length}/60 characters {formData.seoTitle.length > 60 && '(too long)'}
              </p>
            </div>

            <div>
              <label htmlFor="seo-description" className="block text-sm font-medium mb-2">
                SEO Description
                <span className="text-xs text-lux-gray-dark ml-2">(Optional - auto-generated if empty)</span>
              </label>
              <textarea
                id="seo-description"
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                maxLength={155}
                rows={3}
                placeholder="Auto-generated from product description"
                className="w-full px-4 py-2 bg-lux-charcoal border border-lux-charcoal/50 rounded focus:outline-none focus:border-lux-gold focus:ring-2 focus:ring-lux-gold text-lux-cream placeholder:text-lux-gray-dark"
                aria-label="SEO description for product (optimal: 120-155 characters)"
              />
              <p className={`text-xs mt-1 ${formData.seoDescription.length > 155 ? 'text-red-400' : formData.seoDescription.length > 120 ? 'text-lux-gold' : 'text-ink-700'}`}>
                {formData.seoDescription.length}/155 characters {formData.seoDescription.length > 155 && '(too long)'}
              </p>
            </div>
          </div>

          {/* Copy All Button */}
          <div className="flex justify-end">
            <button
              onClick={handleCopyAllProductInfo}
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-lux-charcoal hover:bg-lux-charcoal/80 rounded-lg font-medium transition text-lux-cream text-sm"
              title="Copy all product information to clipboard"
            >
              <Copy className="w-4 h-4" />
              Copy All Product Info
            </button>
          </div>

          {/* Sticky Save Bar */}
          <div className="sticky bottom-0 bg-lux-charcoal border-t border-lux-gold/20 py-4 -mx-6 px-6 mt-8 z-10">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Auto-save indicator */}
              <div className="flex items-center gap-3">
                {lastSaved && (
                  <span className="text-sm text-lux-gray">
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </span>
                )}
                {hasUnsavedChanges && (
                  <span className="text-sm text-lux-gold">
                    • Unsaved changes
                  </span>
                )}
              </div>

              {/* Right: Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep("analyze")}
                  className="px-6 py-2 bg-lux-charcoal/80 hover:bg-lux-charcoal rounded-lg font-medium transition text-lux-cream border border-lux-charcoal/50"
                >
                  ← Re-analyze
                </button>
                <button
                  onClick={() => handleCreateProduct(true)}
                  disabled={creating}
                  className="px-6 py-2 bg-lux-gray-dark hover:bg-lux-gray disabled:bg-lux-charcoal/50 disabled:cursor-not-allowed rounded-lg font-medium transition text-lux-cream"
                >
                  {creating ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin inline mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save Draft"
                  )}
                </button>
                <button
                  onClick={() => handleCreateProduct(false)}
                  disabled={creating}
                  className="px-6 py-2 bg-lux-gold hover:bg-lux-gold-light disabled:bg-lux-charcoal/50 disabled:cursor-not-allowed rounded-lg font-medium transition text-lux-black"
                >
                  {creating ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin inline mr-2" />
                      Publishing...
                    </>
                  ) : (
                    "Publish"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success */}
      {step === "success" && (
        <div className="text-center py-12">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Product Created!</h2>
          <p className="text-ink-600 mb-6">
            Product {sku} has been created as a draft. Review it in the admin dashboard.
          </p>
          <p className="text-sm text-ink-700">
            Redirecting to new product form...
          </p>
        </div>
      )}
    </div>
  );
}
