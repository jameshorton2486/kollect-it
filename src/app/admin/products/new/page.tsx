"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";

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
    <div className="min-h-screen bg-lux-pearl">
      {/* Header */}
      <div className="bg-lux-white border-b border-lux-silver-soft">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-ink-600 hover:text-lux-gold mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Products
          </Link>
          <h1 className="text-2xl font-bold text-lux-black">Add New Product</h1>
          {nextSku && (
            <p className="text-ink-600">
              SKU: <span className="font-mono font-medium">{nextSku}</span>
            </p>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">{error}</div>
          )}

          <div className="bg-lux-white rounded-xl border border-lux-silver-soft p-6 shadow-clean space-y-4">
            <h2 className="heading-subsection text-lux-black">Basic Information</h2>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-label text-lux-gray-dark mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black placeholder:text-lux-gray-light focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
                placeholder="Product title"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-label text-lux-gray-dark mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2.5 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black placeholder:text-lux-gray-light focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent resize-none"
                placeholder="Product description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-label text-lux-gray-dark mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  id="price"
                  required
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-4 py-2.5 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black placeholder:text-lux-gray-light focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-label text-lux-gray-dark mb-2">
                  Category *
                </label>
                <select
                  id="category"
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
                  className="w-full px-4 py-2.5 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
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
              <label htmlFor="subcategory" className="block text-sm font-medium text-label text-lux-gray-dark mb-2">
                Subcategory
              </label>
              <select
                id="subcategory"
                value={form.subcategoryId}
                onChange={(e) => setForm({ ...form, subcategoryId: e.target.value })}
                className="w-full px-4 py-2.5 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent disabled:opacity-50"
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
                <label htmlFor="condition" className="block text-sm font-medium text-label text-lux-gray-dark mb-2">
                  Condition
                </label>
                <select
                  id="condition"
                  value={form.condition}
                  onChange={(e) => setForm({ ...form, condition: e.target.value })}
                  className="w-full px-4 py-2.5 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
                  aria-label="Condition"
                >
                  <option value="Fine">Fine</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-label text-lux-gray-dark mb-2">
                  Status
                </label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-4 py-2.5 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
                  aria-label="Status"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-lux-white rounded-xl border border-lux-silver-soft p-6 shadow-clean space-y-4">
            <h2 className="heading-subsection text-lux-black">Image</h2>
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-label text-lux-gray-dark mb-2">
                Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full px-4 py-2.5 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black placeholder:text-lux-gray-light focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-sm text-lux-gray mt-1">
                Enter a direct URL to your product image
              </p>
            </div>
          </div>

          <div className="bg-lux-white rounded-xl border border-lux-silver-soft p-6 shadow-clean space-y-4">
            <h2 className="heading-subsection text-lux-black">Additional Details</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-label text-lux-gray-dark mb-2">
                  Year
                </label>
                <input
                  type="text"
                  id="year"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className="w-full px-4 py-2.5 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black placeholder:text-lux-gray-light focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
                  placeholder="e.g., 1920"
                />
              </div>

              <div>
                <label htmlFor="artist" className="block text-sm font-medium text-label text-lux-gray-dark mb-2">
                  Artist/Maker
                </label>
                <input
                  type="text"
                  id="artist"
                  value={form.artist}
                  onChange={(e) => setForm({ ...form, artist: e.target.value })}
                  className="w-full px-4 py-2.5 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black placeholder:text-lux-gray-light focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
                  placeholder="Artist or maker name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="medium" className="block text-sm font-medium text-label text-lux-gray-dark mb-2">
                  Medium
                </label>
                <input
                  type="text"
                  id="medium"
                  value={form.medium}
                  onChange={(e) => setForm({ ...form, medium: e.target.value })}
                  className="w-full px-4 py-2.5 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black placeholder:text-lux-gray-light focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
                  placeholder="e.g., Oil on canvas"
                />
              </div>

              <div>
                <label htmlFor="period" className="block text-sm font-medium text-label text-lux-gray-dark mb-2">
                  Period
                </label>
                <input
                  type="text"
                  id="period"
                  value={form.period}
                  onChange={(e) => setForm({ ...form, period: e.target.value })}
                  className="w-full px-4 py-2.5 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black placeholder:text-lux-gray-light focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
                  placeholder="e.g., Art Deco"
                />
              </div>
            </div>
          </div>

          <div className="bg-lux-white rounded-xl border border-lux-silver-soft p-6 shadow-clean">
            <label htmlFor="publish" className="flex items-center gap-3">
              <input
                type="checkbox"
                id="publish"
                checked={!form.isDraft}
                onChange={(e) => setForm({ ...form, isDraft: !e.target.checked })}
                className="w-5 h-5 rounded border-lux-silver-soft text-lux-gold focus:ring-lux-gold"
              />
              <div>
                <span className="font-medium text-lux-black">Publish immediately</span>
                <p className="text-sm text-lux-gray">
                  Uncheck to save as draft
                </p>
              </div>
            </label>
          </div>

          <div className="flex justify-end gap-4">
            <Link
              href="/admin/products"
              className="btn-secondary rounded-full"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary rounded-full inline-flex items-center gap-2 disabled:opacity-50"
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
