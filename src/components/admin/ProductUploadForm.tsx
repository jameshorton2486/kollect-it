"use client";

import { useState } from "react";
import { Upload, Loader, AlertCircle, CheckCircle2 } from "lucide-react";

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

export function ProductUploadForm() {
  const [step, setStep] = useState<"upload" | "analyze" | "edit" | "success">(
    "upload",
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [category, setCategory] = useState("Collectibles");
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
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

  async function uploadToImageKit(file: File): Promise<string> {
    try {
      console.log("Getting ImageKit auth...");
      const authRes = await fetch("/api/imagekit-auth");
      if (!authRes.ok) throw new Error("Failed to get auth");
      const auth = await authRes.json();

      console.log("Uploading to ImageKit...");
      const uploadForm = new FormData();
      uploadForm.append("file", file);
      uploadForm.append("fileName", file.name);
      uploadForm.append("publicKey", auth.publicKey);
      uploadForm.append("token", auth.token);
      uploadForm.append("expire", auth.expire.toString());
      uploadForm.append("signature", auth.signature);

      const uploadRes = await fetch(
        "https://upload.imagekit.io/api/v1/files/upload",
        {
          method: "POST",
          body: uploadForm,
        },
      );

      if (!uploadRes.ok) throw new Error("Upload failed");
      const uploadData = await uploadRes.json();
      console.log("Upload complete:", uploadData.url);
      return uploadData.url;
    } catch (err) {
      throw new Error(
        `ImageKit upload failed: ${err instanceof Error ? err.message : "Unknown"}`,
      );
    }
  }

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be less than 10MB");
      return;
    }

    setImageFile(file);
    setError("");
    setStep("upload");
  }

  async function handleUpload() {
    if (!imageFile) {
      setError("No image selected");
      return;
    }

    setUploading(true);
    setError("");
    try {
      const url = await uploadToImageKit(imageFile);
      setImageUrl(url);
      setSuccess("Image uploaded successfully!");
      setTimeout(() => setSuccess(""), 3000);
      setStep("analyze");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Upload failed - try again",
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleAnalyze() {
    if (!imageUrl) {
      setError("Please upload an image first");
      return;
    }

    setAnalyzing(true);
    setError("");
    console.log("Starting AI analysis...");

    try {
      const res = await fetch("/api/admin/products/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, category }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }

      const data = await res.json();
      console.log("Analysis complete:", data);

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
      setError(
        `Analysis failed: ${err instanceof Error ? err.message : "Try again"}`,
      );
      console.error("Analysis error:", err);
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleCreateProduct() {
    if (!imageUrl || !analysis) {
      setError("Missing required data");
      return;
    }

    setCreating(true);
    setError("");

    try {
      const res = await fetch("/api/admin/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          category,
          ...formData,
          aiAnalysis: analysis,
          isDraft: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Creation failed");
      }

      await res.json();
      setStep("success");

      // Reset form
      setTimeout(() => {
        setImageFile(null);
        setImageUrl("");
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
        setStep("upload");
      }, 3000);
    } catch (err) {
      setError(
        `Creation failed: ${err instanceof Error ? err.message : "Try again"}`,
      );
      console.error("Creation error:", err);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
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

      {/* STEP 1: UPLOAD */}
      {step === "upload" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-amber-500">
            Upload Product Photo
          </h2>

          <div className="border-2 border-dashed border-amber-500/50 rounded-lg p-12 text-center hover:border-amber-500 hover:bg-amber-500/5 transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              id="imageInput"
              disabled={uploading}
            />
            <label
              htmlFor="imageInput"
              className="flex flex-col items-center gap-3 cursor-pointer"
            >
              <Upload className="w-12 h-12 text-amber-500" />
              <div>
                <p className="font-semibold text-lg">Drop your photo here</p>
                <p className="text-sm text-gray-400">
                  or click to browse (JPG, PNG up to 10MB)
                </p>
              </div>
            </label>
          </div>

          {/* File Preview */}
          {imageFile && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded border border-amber-500/30">
                <div className="flex-1">
                  <p className="font-semibold">{imageFile.name}</p>
                  <p className="text-sm text-gray-400">
                    {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => setImageFile(null)}
                  className="px-3 py-1 text-sm text-gray-400 hover:text-white"
                >
                  Change
                </button>
              </div>

              <div className="space-y-3">
                <label className="block">
                  <span className="text-sm text-gray-400 mb-2 block">
                    Product Category
                  </span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-amber-500/30 rounded text-white focus:border-amber-500 outline-none"
                  >
                    <option>Antique Books</option>
                    <option>Fine Art</option>
                    <option>Collectibles</option>
                    <option>Militaria</option>
                  </select>
                </label>

                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full px-6 py-3 bg-amber-500 text-black font-semibold rounded hover:bg-amber-600 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {uploading && <Loader className="w-4 h-4 animate-spin" />}
                  {uploading ? "Uploading..." : "Upload to ImageKit"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: ANALYZE (Loading) */}
      {step === "analyze" && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Loader className="w-12 h-12 text-amber-500 animate-spin" />
          <p className="text-lg text-gray-300">
            Analyzing with Claude & GPT-4V...
          </p>
          <p className="text-sm text-gray-500">This takes 20-30 seconds</p>
        </div>
      )}

      {/* STEP 3: EDIT */}
      {step === "edit" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-amber-500">Review & Edit</h2>

          {/* Image Preview */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Product"
              className="w-full max-h-80 object-cover rounded border border-amber-500/30"
            />
          )}

          {/* Image Quality Assessment */}
          {analysis?.imageQuality && (
            <div className="p-4 bg-gray-800 border border-amber-500/30 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Photo Quality</span>
                <span className="text-2xl text-amber-500 font-bold">
                  {analysis.imageQuality}/10
                </span>
              </div>
              <p className="text-sm text-gray-300">
                {analysis.photographyNotes}
              </p>
            </div>
          )}

          {/* Editable Form */}
          <div className="space-y-4 p-4 bg-gray-800/50 rounded border border-amber-500/30">
            <h3 className="font-semibold text-amber-500">Product Details</h3>

            <div>
              <label
                htmlFor="title-input"
                className="block text-sm text-gray-400 mb-2"
              >
                Title
              </label>
              <input
                id="title-input"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-900 border border-amber-500/30 rounded text-white focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="description-input"
                className="block text-sm text-gray-400 mb-2"
              >
                Description (300-400 words)
              </label>
              <textarea
                id="description-input"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                rows={8}
                className="w-full px-4 py-2 bg-gray-900 border border-amber-500/30 rounded text-white focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="short-desc-input"
                className="block text-sm text-gray-400 mb-2"
              >
                Short Description (50-75 words)
              </label>
              <textarea
                id="short-desc-input"
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shortDescription: e.target.value,
                  })
                }
                rows={3}
                className="w-full px-4 py-2 bg-gray-900 border border-amber-500/30 rounded text-white focus:border-amber-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="era-input"
                  className="block text-sm text-gray-400 mb-2"
                >
                  Era
                </label>
                <input
                  id="era-input"
                  type="text"
                  value={formData.estimatedEra}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimatedEra: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-900 border border-amber-500/30 rounded text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="price-input"
                  className="block text-sm text-gray-400 mb-2"
                >
                  Price
                </label>
                <input
                  id="price-input"
                  type="number"
                  value={formData.suggestedPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      suggestedPrice: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-900 border border-amber-500/30 rounded text-white focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="rarity-select"
                  className="block text-sm text-gray-400 mb-2"
                >
                  Rarity
                </label>
                <select
                  id="rarity-select"
                  value={formData.rarity}
                  onChange={(e) =>
                    setFormData({ ...formData, rarity: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-900 border border-amber-500/30 rounded text-white focus:border-amber-500 outline-none"
                >
                  <option>Common</option>
                  <option>Uncommon</option>
                  <option>Rare</option>
                  <option>Very Rare</option>
                  <option>Extremely Rare</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="authenticity-select"
                  className="block text-sm text-gray-400 mb-2"
                >
                  Authenticity
                </label>
                <select
                  id="authenticity-select"
                  value={formData.authenticity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      authenticity: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-900 border border-amber-500/30 rounded text-white focus:border-amber-500 outline-none"
                >
                  <option>Believed authentic</option>
                  <option>Attributed</option>
                  <option>School of</option>
                  <option>Possibly reproduction</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="seo-title-input"
                className="block text-sm text-gray-400 mb-2"
              >
                SEO Title (max 60 chars)
              </label>
              <input
                id="seo-title-input"
                type="text"
                value={formData.seoTitle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    seoTitle: e.target.value.substring(0, 60),
                  })
                }
                maxLength={60}
                className="w-full px-4 py-2 bg-gray-900 border border-amber-500/30 rounded text-white focus:border-amber-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.seoTitle.length}/60
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                SEO Description (max 155 chars)
              </label>
              <textarea
                value={formData.seoDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    seoDescription: e.target.value.substring(0, 155),
                  })
                }
                maxLength={155}
                rows={2}
                className="w-full px-4 py-2 bg-gray-900 border border-amber-500/30 rounded text-white focus:border-amber-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.seoDescription.length}/155
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setStep("upload")}
              className="flex-1 px-6 py-3 border border-amber-500/50 text-amber-500 font-semibold rounded hover:border-amber-500"
            >
              Back to Upload
            </button>

            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="flex-1 px-6 py-3 border border-amber-500/50 text-amber-500 font-semibold rounded hover:border-amber-500 disabled:opacity-50"
            >
              {analyzing ? "Re-analyzing..." : "Re-analyze with AI"}
            </button>

            <button
              onClick={handleCreateProduct}
              disabled={creating}
              className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {creating && <Loader className="w-4 h-4 animate-spin" />}
              {creating ? "Creating..." : "Create Draft Product"}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: SUCCESS */}
      {step === "success" && (
        <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
          <h3 className="text-2xl font-bold text-amber-500">
            Product Created!
          </h3>
          <p className="text-gray-300">
            Your product has been saved as a draft. Go to the Products tab to
            publish it.
          </p>
        </div>
      )}
    </div>
  );
}

