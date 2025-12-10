"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  Package,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Product {
  id: string;
  sku: string;
  title: string;
  price: number;
  status: string;
  isDraft: boolean;
  featured: boolean;
  category: { id: string; name: string };
  images: { url: string }[];
  createdAt: string;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pages: number;
}

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, currentPage, statusFilter]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
      });
      if (statusFilter) params.set("status", statusFilter);
      if (searchTerm) params.set("search", searchTerm);

      const res = await fetch(`/api/admin/products?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");

      const data: ProductsResponse = await res.json();
      setProducts(data.products);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
        setTotal((prev) => prev - 1);
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete product");
    } finally {
      setDeleting(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (status === "loading" || (status === "authenticated" && loading && products.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (status !== "authenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-lux-pearl">
      {/* Header */}
      <div className="bg-lux-white border-b border-lux-silver-soft">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-lux-black">Products</h1>
              <p className="text-ink-600">{total} total products</p>
            </div>
            <Link
              href="/admin/products/new"
              className="btn-primary rounded-full inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Add Product
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-lux-white rounded-xl border border-lux-silver-soft p-4 mb-6 shadow-clean">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-lux-gray-light" size={20} />
              <input
                type="text"
                placeholder="Search by title or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black placeholder:text-lux-gray-light focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
              aria-label="Filter by status"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="sold">Sold</option>
              <option value="pending">Pending</option>
            </select>
            <button
              type="submit"
              className="btn-primary rounded-lg"
            >
              Search
            </button>
          </form>
        </div>

        {/* Products Table */}
        <div className="bg-lux-white rounded-xl border border-lux-silver-soft overflow-hidden shadow-clean">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="text-lux-gray-light mb-4" size={64} />
              <h3 className="text-xl font-medium text-lux-black mb-2">No Products Yet</h3>
              <p className="text-ink-600 mb-4">Get started by adding your first product.</p>
              <Link
                href="/admin/products/new"
                className="btn-primary rounded-full inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Add Product
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-lux-cream border-b border-lux-silver-soft">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-label text-lux-gray-dark">Product</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-label text-lux-gray-dark">SKU</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-label text-lux-gray-dark">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-label text-lux-gray-dark">Price</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-label text-lux-gray-dark">Status</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-label text-lux-gray-dark">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-lux-silver-soft">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-lux-cream/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded bg-lux-pearl overflow-hidden flex-shrink-0">
                              {product.images[0] ? (
                                <Image
                                  src={product.images[0].url}
                                  alt={product.title}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-lux-gray-light">
                                  <Package size={20} />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-lux-black truncate">{product.title}</p>
                              {product.isDraft && (
                                <span className="text-xs text-orange-600">Draft</span>
                              )}
                              {product.featured && (
                                <span className="text-xs text-lux-gold ml-2">Featured</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-ink-600">{product.sku}</td>
                        <td className="px-4 py-3 text-sm text-ink-600">{product.category.name}</td>
                        <td className="px-4 py-3 text-sm font-medium text-lux-black">{formatPrice(product.price)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-1 text-xs rounded-full ${
                              product.status === "active"
                                ? "bg-green-100 text-green-700"
                                : product.status === "sold"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="p-2 text-ink-600 hover:text-lux-gold hover:bg-lux-cream rounded transition-colors"
                              aria-label="Edit product"
                            >
                              <Edit size={18} />
                            </Link>
                            <button
                              onClick={() => handleDelete(product.id, product.title)}
                              disabled={deleting === product.id}
                              className="p-2 text-ink-600 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-50 transition-colors"
                              aria-label="Delete product"
                            >
                              {deleting === product.id ? (
                                <Loader2 className="animate-spin" size={18} />
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-lux-silver-soft bg-lux-cream">
                  <p className="text-sm text-ink-600">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-lux-silver-soft rounded hover:bg-lux-pearl disabled:opacity-50 transition-colors"
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-lux-silver-soft rounded hover:bg-lux-pearl disabled:opacity-50 transition-colors"
                      aria-label="Next page"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
