"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, ImagePlus } from "lucide-react";

interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export default function NewProductPage() {
  const { status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [nextSku, setNextSku] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
    subcategoryId: "",
    condition: "Good",
    status: "active",
    featured: false,
    isDraft: true,
    year: "",
    artist: "",
    medium: "",
    period: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, skuRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/admin/products/next-sku"),
        ]);

        if (catRes.ok) {
          const cats = await catRes.json();
          setCategories(Array.isArray(cats) ? cats : []);
          if (cats.length > 0) {
            setForm((f) => ({ 
              ...f, 
              categoryId: cats[0].id,
              subcategoryId: cats[0].subcategories?.[0]?.id || ""
            }));
          }
        }

        if (skuRes.ok) {
          const skuData = await skuRes.json();
          setNextSku(skuData.suggestedSKU || "");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      // Find category name
      const category = categories.find((c) => c.id === form.categoryId);

      const res = await fetch("/api/admin/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: nextSku,
          title: form.title,
          description: form.description,
          category: category?.name || "",
          categoryId: form.categoryId,
          subcategoryId: form.subcategoryId || undefined,
          suggestedPrice: parseFloat(form.price) || 0,
          isDraft: form.isDraft,
          imageUrls: form.imageUrl
            ? [{ url: form.imageUrl, type: "main" }]
            : [],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      router.push("/admin/products");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Products
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          {nextSku && (
            <p className="text-gray-600">
              SKU: <span className="font-mono font-medium">{nextSku}</span>
            </p>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
          )}

          <div className="bg-white rounded-lg border p-6 space-y-4">
            <h2 className="font-semibold text-lg">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Product title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Product description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={form.categoryId}
                  onChange={(e) => {
                    const selectedCat = categories.find(c => c.id === e.target.value);
                    setForm({ 
                      ...form, 
                      categoryId: e.target.value,
                      subcategoryId: selectedCat?.subcategories?.[0]?.id || ""
                    });
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  aria-label="Category"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subcategory
              </label>
              <select
                value={form.subcategoryId}
                onChange={(e) => setForm({ ...form, subcategoryId: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Subcategory"
                disabled={!form.categoryId}
              >
                <option value="">Select Subcategory (Optional)</option>
                {categories
                  .find((c) => c.id === form.categoryId)
                  ?.subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condition
                </label>
                <select
                  value={form.condition}
                  onChange={(e) => setForm({ ...form, condition: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  aria-label="Condition"
                >
                  <option value="Fine">Fine</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  aria-label="Status"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6 space-y-4">
            <h2 className="font-semibold text-lg">Image</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter a direct URL to your product image
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6 space-y-4">
            <h2 className="font-semibold text-lg">Additional Details</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="text"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g., 1920"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Artist/Maker
                </label>
                <input
                  type="text"
                  value={form.artist}
                  onChange={(e) => setForm({ ...form, artist: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Artist or maker name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medium
                </label>
                <input
                  type="text"
                  value={form.medium}
                  onChange={(e) => setForm({ ...form, medium: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g., Oil on canvas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Period
                </label>
                <input
                  type="text"
                  value={form.period}
                  onChange={(e) => setForm({ ...form, period: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g., Art Deco"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={!form.isDraft}
                onChange={(e) => setForm({ ...form, isDraft: !e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="font-medium">Publish immediately</span>
                <p className="text-sm text-gray-500">
                  Uncheck to save as draft
                </p>
              </div>
            </label>
          </div>

          <div className="flex justify-end gap-4">
            <Link
              href="/admin/products"
              className="px-6 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Save size={20} />
              )}
              {saving ? "Saving..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
