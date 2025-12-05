"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, Check, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  createdAt: string;
}

interface EditValues {
  [categoryId: string]: {
    description: string;
  };
}

export default function CategoriesPage() {
  const { status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<EditValues>({});

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchCategories();
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (status !== "authenticated") {
    return null;
  }

  const handleImageUpload = async (categoryId: string, file: File) => {
    setUploadingId(categoryId);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("categoryId", categoryId);

      const res = await fetch("/api/admin/categories/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const result = await res.json();

      // Update local state
      setCategories(
        categories.map((cat) =>
          cat.id === categoryId ? { ...cat, image: result.imageUrl } : cat,
        ),
      );
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingId(null);
    }
  };

  const handleSaveEdits = async (categoryId: string) => {
    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editValues[categoryId] || {}),
      });

      if (!res.ok) throw new Error("Save failed");

      const updated = await res.json();
      setCategories(
        categories.map((cat) => (cat.id === categoryId ? updated : cat)),
      );
      setEditingId(null);
      setEditValues({});
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-ink-900 mb-2">
            Category Management
          </h1>
          <p className="text-ink-600">
            Upload and manage category images for your galleries
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-surface-0 rounded-lg shadow-md overflow-hidden"
            >
              {/* Image Section */}
              <div className="relative w-full h-48 bg-surface-100 overflow-hidden">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface-200">
                    <span className="text-gray-600">No image</span>
                  </div>
                )}

                {/* Upload Button Overlay */}
                <label className="absolute inset-0 bg-black/0 hover:bg-black/50 flex items-center justify-center cursor-pointer transition-all duration-200 group">
                  <div className="flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {uploadingId === category.id ? (
                      <>
                        <Loader2
                          className="animate-spin text-white"
                          size={32}
                        />
                        <span className="text-white text-sm">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="text-white" size={32} />
                        <span className="text-white text-sm font-medium">
                          Upload Image
                        </span>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(category.id, file);
                      }
                    }}
                    disabled={uploadingId === category.id}
                  />
                </label>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-ink-900 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-ink-700 mb-3">
                    Slug:{" "}
                    <code className="bg-surface-100 px-2 py-1">
                      {category.slug}
                    </code>
                  </p>

                  {editingId === category.id ? (
                    <textarea
                      title="Edit category description"
                      placeholder="Enter category description"
                      value={
                        editValues[category.id]?.description ||
                        category.description
                      }
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          [category.id]: {
                            description: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 border border-border-300 rounded text-sm"
                      rows={3}
                    />
                  ) : (
                    <p className="text-ink-600 text-sm">
                      {category.description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {editingId === category.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdits(category.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <Check size={16} />
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditValues({});
                        }}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-ink-900 px-3 py-2 rounded text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(category.id);
                        setEditValues({
                          [category.id]: {
                            description: category.description,
                          },
                        });
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                    >
                      Edit Description
                    </button>
                  )}
                </div>

                {/* Info */}
                <div className="mt-4 text-xs text-ink-700">
                  <p>
                    Created: {new Date(category.createdAt).toLocaleDateString()}
                  </p>
                  {category.image && (
                    <p className="text-green-600 font-medium mt-1">
                      ✓ Image uploaded
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-ink-700">No categories found</p>
          </div>
        )}
      </div>
    </div>
  );
}

