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
  const [newAppraisalUrl, setNewAppraisalUrl] = useState("");
  
  // Step 2: Images
  const [images, setImages] = useState<UploadedImage[]>([]);
  
  // Step 3: AI Analysis
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  
  // Step 4: Edit & Create
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

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

  // Auto-suggest SKU on mount
  useEffect(() => {
    fetchNextSKU();
  }, []);

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
            <div className="flex gap-2">
              <input
                type="text"
                value={newAppraisalUrl}
                onChange={(e) => setNewAppraisalUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/abc123/view"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-gold-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddAppraisalUrl();
                  }
                }}
              />
              <button
                onClick={handleAddAppraisalUrl}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
              >
                Add
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Press Enter or click Add to add multiple URLs
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

