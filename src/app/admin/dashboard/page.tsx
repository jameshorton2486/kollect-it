"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import ImageUpload from "@/components/admin/ImageUpload";
import { ProductUploadForm } from "@/components/admin/ProductUploadForm";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import {
  Package,
  CheckCircle2,
  ShoppingBag,
  DollarSign,
  Plus,
  Settings,
  Users,
  Download,
} from "lucide-react";
import { getAdminPreviewImageUrl } from "@/lib/image-helpers";

interface Product {
  id: string;
  title: string;
  price: number;
  Category: { name: string };
  Image: { url: string }[];
  status: string;
  createdAt: string;
  isDraft: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string | null;
  customerEmail: string | null;
  status: string;
  total: number;
  paymentStatus: string;
  createdAt: string;
  items: { id: string; quantity: number }[];
}

/** Renders current time only on client to avoid hydration mismatch. */
function AdminDashboardTime() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    setNow(new Date().toLocaleString());
    const t = setInterval(() => setNow(new Date().toLocaleString()), 1000);
    return () => clearInterval(t);
  }, []);
  return <>{now ?? "—"}</>;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAIUpload, setShowAIUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "sold" | "draft"
  >("all");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Derived data
  const monthlyRevenueStr = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const revenue = orders
      .filter(
        (o) => o.paymentStatus === "paid" && new Date(o.createdAt) >= start,
      )
      .reduce((sum, o) => sum + (o.total || 0), 0);
    return revenue.toLocaleString("en-US", { minimumFractionDigits: 2 });
  }, [orders]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery = q
        ? p.title.toLowerCase().includes(q) ||
          p.Category.name.toLowerCase().includes(q)
        : true;
      const matchesStatus =
        statusFilter === "all" ? true : p.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [products, searchQuery, statusFilter]);

  const pagedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, page]);

  const hasNoNextPage = useMemo(
    () => page * pageSize >= filteredProducts.length,
    [filteredProducts, page],
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.role === "admin") {
      fetchProducts();
      fetchCategories();
      fetchOrders();
    }
  }, [session]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products?limit=100");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleExportProducts = () => {
    const csvContent = [
      ["Title", "Category", "Price", "Status", "Date Added"],
      ...filteredProducts.map((product) => [
        product.title,
        product.Category.name,
        `$${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        product.status,
        new Date(product.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`,
    );
    element.setAttribute(
      "download",
      `products-${new Date().toISOString().split("T")[0]}.csv`,
    );
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (session?.user?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-lux-pearl">
      {/* Header */}
      <header className="bg-lux-charcoal shadow-sm border-b border-lux-charcoal/50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-serif font-bold text-lux-cream">
                Kollect-It Admin Dashboard
              </h1>
              <p className="text-sm text-lux-cream/80 mt-1">
                Welcome back, {session.user.name || session.user.email}
              </p>
              <p className="text-xs text-lux-gray-dark" suppressHydrationWarning>
                <AdminDashboardTime />
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => router.push("/admin/orders")}
                className="btn-primary rounded-full"
              >
                Manage Orders
              </button>
              <button
                onClick={() => window.open("/", "_blank")}
                className="px-4 py-2 text-lux-cream/80 hover:text-lux-gold transition"
              >
                View Site
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className="ki-section container mx-auto px-4 md:px-6 lg:px-8 py-8"
        role="main"
      >
        {/* Enhanced Dashboard Overview */}
        <div className="mb-8">
          <DashboardOverview />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Package className="text-ink" size={20} />}
            label="Total Products"
            value={products.length.toString()}
          />
          <StatCard
            icon={<CheckCircle2 className="text-green-700" size={20} />}
            label="Active Products"
            value={products
              .filter((p) => p.status === "active")
              .length.toString()}
            highlight="green"
          />
          <StatCard
            icon={<ShoppingBag className="text-indigo-700" size={20} />}
            label="Total Orders"
            value={orders.length.toString()}
          />
          <StatCard
            icon={<DollarSign className="text-emerald-700" size={20} />}
            label="Revenue (This Month)"
            value={`$${monthlyRevenueStr}`}
          />
        </div>

        {/* Actions */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary rounded-full inline-flex items-center gap-2"
          >
            <Plus size={18} /> {showAddForm ? "Cancel" : "Add New Product"}
          </button>
          <button
            onClick={() => setShowAIUpload(!showAIUpload)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition font-semibold"
          >
            <Plus size={18} /> {showAIUpload ? "Cancel" : "AI Create Product"}
          </button>
          <button
            onClick={() => router.push("/admin/orders")}
            className="btn-secondary rounded-full inline-flex items-center gap-2"
          >
            <ShoppingBag size={18} /> Manage Orders
          </button>
          <button
            onClick={() => router.push("/admin/customers")}
            className="btn-secondary rounded-full inline-flex items-center gap-2"
          >
            <Users size={18} /> View Customers
          </button>
          <button
            onClick={() => router.push("/admin/settings")}
            className="btn-secondary rounded-full inline-flex items-center gap-2"
          >
            <Settings size={18} /> Settings
          </button>
          <button
            onClick={handleExportProducts}
            className="btn-secondary rounded-full inline-flex items-center gap-2"
            title="Export filtered products as CSV"
          >
            <Download size={18} /> Export CSV
          </button>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <ProductForm
            categories={categories}
            onSuccess={() => {
              fetchProducts();
              setShowAddForm(false);
            }}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {/* AI Product Upload Form */}
        {showAIUpload && (
          <div className="bg-lux-white rounded-xl border border-lux-silver-soft shadow-clean p-6 mb-6">
            <h2 className="heading-subsection mb-4 text-lux-gold">
              AI-Powered Product Creation
            </h2>
            <p className="text-sm text-ink-600 mb-4">
              Upload a photo and let Claude + GPT-4V analyze it to create a
              professional product listing.
            </p>
            <ProductUploadForm />
          </div>
        )}

        {/* Products Table */}
        <div className="bg-lux-white rounded-xl border border-lux-silver-soft shadow-clean overflow-hidden">
          <div className="px-6 py-4 border-b border-lux-silver-soft bg-lux-cream flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="heading-subsection text-lux-black">Products</h2>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search products..."
                className="w-64 max-w-full px-3 py-2 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black placeholder:text-lux-gray-dark focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
                aria-label="Search products"
              />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as typeof statusFilter);
                  setPage(1);
                }}
                className="px-3 py-2 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
                aria-label="Filter by status"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="sold">Sold</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-lux-cream border-b border-lux-silver-soft">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-label text-lux-gray-dark uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-label text-lux-gray-dark uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-label text-lux-gray-dark uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-label text-lux-gray-dark uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-label text-lux-gray-dark uppercase tracking-wider">
                    Date Added
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-label text-lux-gray-dark uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-lux-white divide-y divide-lux-silver-soft">
                {pagedProducts.map((product: Product) => (
                  <tr key={product.id} className="hover:bg-lux-cream/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.Image[0] && (
                          <img
                            src={getAdminPreviewImageUrl(product.Image[0].url)}
                            alt={product.title}
                            className="w-12 h-12 rounded object-cover mr-3"
                          />
                        )}
                        <div className="text-sm font-medium text-ink max-w-md truncate">
                          {product.title}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-ink">
                        {product.Category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-ink">
                        ${product.price.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.status === "active"
                              ? "bg-green-100 text-green-800"
                              : product.status === "sold"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {product.status}
                        </span>
                        {product.isDraft && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-lux-cream text-lux-gray-dark">
                            Draft
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-lux-gray">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900 ml-4"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-lux-silver-soft bg-lux-cream text-sm">
            <div className="text-ink-600">Page {page}</div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 border border-lux-silver-soft rounded hover:bg-lux-pearl disabled:opacity-50 transition-colors"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <button
                className="px-3 py-1 border border-lux-silver-soft rounded hover:bg-lux-pearl disabled:opacity-50 transition-colors"
                onClick={() => setPage((p) => p + 1)}
                disabled={hasNoNextPage}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-lux-white rounded-xl border border-lux-silver-soft shadow-clean overflow-hidden mt-8">
          <div className="px-6 py-4 border-b border-lux-silver-soft bg-lux-cream flex items-center justify-between">
            <h2 className="heading-subsection text-lux-black">Recent Orders</h2>
            <button
              onClick={() => router.push("/admin/orders")}
              className="text-sm text-lux-gold hover:underline"
            >
              View All Orders
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-lux-cream border-b border-lux-silver-soft">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-label text-lux-gray-dark uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-label text-lux-gray-dark uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-label text-lux-gray-dark uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-label text-lux-gray-dark uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-label text-lux-gray-dark uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-lux-white divide-y divide-lux-silver-soft">
                {orders.slice(0, 10).map((order: Order) => {
                  const statusClass =
                    order.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : order.status === "processing" ||
                            order.status === "paid"
                          ? "bg-amber-100 text-amber-900"
                          : "bg-lux-cream text-lux-black";
                  return (
                    <tr key={order.id} className="hover:bg-lux-cream/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-lux-black">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-600">
                        {order.customerName || "Guest"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-lux-gray">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">
                        ${(order.total || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: "green" | "blue" | "amber" | "purple" | "emerald";
}) {
  const color =
    highlight === "green"
      ? "text-green-600"
      : highlight === "blue"
        ? "text-blue-600"
        : highlight === "amber"
          ? "text-lux-gold"
          : highlight === "emerald"
            ? "text-emerald-700"
            : "text-lux-black";
  return (
    <div className="bg-lux-white rounded-xl border border-lux-silver-soft shadow-clean p-6">
      <div className="flex items-center gap-3 text-sm font-medium text-label text-lux-gray">
        {icon}
        <span>{label}</span>
      </div>
      <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );
}

interface ImageData {
  url: string;
  publicId?: string;
  alt?: string;
}

function ProductForm({
  categories,
  onSuccess,
  onCancel,
}: {
  categories: Category[];
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: categories[0]?.id || "",
    condition: "Fine",
    year: "",
    artist: "",
    medium: "",
    period: "",
    featured: false,
  });
  const [images, setImages] = useState<ImageData[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: images.map((img, index) => ({
            url: img.url,
            alt: img.alt || formData.title,
            order: index,
          })),
        }),
      });

      if (res.ok) {
        // Reset form
        setFormData({
          title: "",
          description: "",
          price: "",
          categoryId: categories[0]?.id || "",
          condition: "Fine",
          year: "",
          artist: "",
          medium: "",
          period: "",
          featured: false,
        });
        setImages([]);
        onSuccess();
      } else {
        alert("Error creating product. Please try again.");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Error creating product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-lux-white rounded-xl border border-lux-silver-soft shadow-clean p-6 mb-6">
      <h3 className="heading-subsection text-lux-black mb-4">Add New Product</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-label text-lux-gray-dark mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-2.5 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black placeholder:text-lux-gray-dark focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
          />
        </div>

        <div className="col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-label text-lux-gray-dark mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            required
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-2.5 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black placeholder:text-lux-gray-dark focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-label text-lux-gray-dark mb-2"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            required
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="w-full px-4 py-2.5 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black placeholder:text-lux-gray-dark focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-label text-lux-gray-dark mb-2"
          >
            Category
          </label>
          <select
            id="category"
            required
            value={formData.categoryId}
            onChange={(e) =>
              setFormData({ ...formData, categoryId: e.target.value })
            }
            className="w-full px-4 py-2.5 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="condition"
            className="block text-sm font-medium text-label text-lux-gray-dark mb-2"
          >
            Condition
          </label>
          <select
            id="condition"
            value={formData.condition}
            onChange={(e) =>
              setFormData({ ...formData, condition: e.target.value })
            }
            className="w-full px-4 py-2.5 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
          >
            <option>Fine</option>
            <option>Very Good</option>
            <option>Good</option>
            <option>Fair</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="year"
            className="block text-sm font-medium text-label text-lux-gray-dark mb-2"
          >
            Year
          </label>
          <input
            type="text"
            id="year"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            className="w-full px-4 py-2.5 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black placeholder:text-lux-gray-dark focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
            placeholder="e.g., 1920, c. 1850, 19th Century"
          />
        </div>

        <div>
          <label
            htmlFor="artist"
            className="block text-sm font-medium text-label text-lux-gray-dark mb-2"
          >
            Artist/Maker
          </label>
          <input
            type="text"
            id="artist"
            value={formData.artist}
            onChange={(e) =>
              setFormData({ ...formData, artist: e.target.value })
            }
            className="w-full px-4 py-2.5 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black placeholder:text-lux-gray-dark focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
            placeholder="e.g., John Smith, Unknown"
          />
        </div>

        <div>
          <label
            htmlFor="medium"
            className="block text-sm font-medium text-label text-lux-gray-dark mb-2"
          >
            Medium/Material
          </label>
          <input
            type="text"
            id="medium"
            value={formData.medium}
            onChange={(e) =>
              setFormData({ ...formData, medium: e.target.value })
            }
            className="w-full px-4 py-2.5 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black placeholder:text-lux-gray-dark focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
            placeholder="e.g., Oil on Canvas, Sterling Silver"
          />
        </div>

        <div>
          <label
            htmlFor="period"
            className="block text-sm font-medium text-label text-lux-gray-dark mb-2"
          >
            Period/Era
          </label>
          <input
            type="text"
            id="period"
            value={formData.period}
            onChange={(e) =>
              setFormData({ ...formData, period: e.target.value })
            }
            className="w-full px-4 py-2.5 border border-lux-silver-soft rounded-lg bg-lux-pearl text-lux-black placeholder:text-lux-gray-dark focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
            placeholder="e.g., Victorian, Art Deco, WWII"
          />
        </div>

        <div
          className="col-span-2"
          role="group"
          aria-labelledby="product-images-label"
        >
          <div
            id="product-images-label"
            className="block text-sm font-medium text-label text-lux-gray-dark mb-2"
          >
            Product Images
          </div>
          <ImageUpload images={images} onChange={setImages} maxImages={8} />
        </div>

        <div className="col-span-2 flex items-center">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) =>
              setFormData({ ...formData, featured: e.target.checked })
            }
            className="w-4 h-4 text-lux-gold border-lux-silver-soft rounded focus:ring-lux-gold"
          />
          <label htmlFor="featured" className="ml-2 text-sm text-ink-600">
            Feature this product on homepage
          </label>
        </div>

        <div className="col-span-2 flex gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary rounded-full disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Product"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary rounded-full"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
