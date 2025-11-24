"use client";

/**
 * Approval Queue Dashboard
 * Phase 3 - Admin interface for reviewing AI-generated products
 */

import { useState, useEffect } from "react";

interface AIProduct {
  id: string;
  aiTitle: string;
  aiDescription: string;
  aiCategory: string;
  aiCondition: string;
  suggestedPrice: number;
  priceLowRange: number;
  priceHighRange: number;
  priceConfidence: number;
  status: string;
  createdAt: string;
  imageUrl?: string;
}

interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

export function ApprovalQueue() {
  const [products, setProducts] = useState<AIProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filter, setFilter] = useState<
    "PENDING" | "APPROVED" | "REJECTED" | "ALL"
  >("PENDING");
  const [selectedProduct, setSelectedProduct] = useState<AIProduct | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, [filter, pagination.page]);

  async function fetchProducts() {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filter !== "ALL" && { status: filter }),
      });

      const response = await fetch(`/api/admin/products/queue?${params}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const data = await response.json();
      setProducts(data.products || []);
      setPagination((prev) => ({
        ...prev,
        total: data.total || 0,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  async function approveProduct(productId: string, finalPrice: number) {
    try {
      const response = await fetch("/api/admin/products/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, finalPrice }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve product");
      }

      // Refresh list
      await fetchProducts();
      setSelectedProduct(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to approve product",
      );
    }
  }

  async function rejectProduct(productId: string, reason: string) {
    try {
      const response = await fetch("/api/admin/products/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, reason }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject product");
      }

      await fetchProducts();
      setSelectedProduct(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject product");
    }
  }

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="min-h-screen bg-lux-carbon text-lux-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-lux-gold mb-2">
            Product Approval Queue
          </h1>
          <p className="text-lux-gray">
            Review and approve AI-generated products for the marketplace
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="mb-6 flex gap-4">
          {(["PENDING", "APPROVED", "REJECTED", "ALL"] as const).map(
            (status) => (
              <button
                key={status}
                onClick={() => {
                  setFilter(status);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  filter === status
                    ? "bg-lux-gold text-lux-carbon"
                    : "bg-lux-charcoal text-lux-white hover:bg-lux-charcoal/80"
                }`}
              >
                {status}
              </button>
            ),
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product List */}
          <div className="lg:col-span-2">
            <div className="bg-lux-charcoal rounded-lg overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-lux-gray">
                  <p>Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="p-8 text-center text-lux-gray">
                  <p>No products to review</p>
                </div>
              ) : (
                <div className="divide-y divide-lux-charcoal/80">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`p-6 cursor-pointer transition-colors ${
                        selectedProduct?.id === product.id
                          ? "bg-lux-charcoal/80 border-l-4 border-lux-gold"
                          : "hover:bg-lux-charcoal/80"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-lux-white mb-2">
                            {product.aiTitle}
                          </h3>
                          <p className="text-sm text-lux-gray mb-3">
                            {product.aiDescription.substring(0, 100)}...
                          </p>
                          <div className="flex gap-4 text-sm">
                            <span className="text-lux-gold">
                              ${product.suggestedPrice}
                            </span>
                            <span className="text-lux-gray">
                              {product.aiCategory}
                            </span>
                            <span className="text-lux-gray">
                              {product.aiCondition}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              product.status === "PENDING"
                                ? "bg-yellow-900/30 text-yellow-200"
                                : product.status === "APPROVED"
                                  ? "bg-green-900/30 text-green-200"
                                  : "bg-red-900/30 text-red-200"
                            }`}
                          >
                            {product.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.max(1, prev.page - 1),
                    }))
                  }
                  disabled={pagination.page === 1}
                  className="px-4 py-2 bg-lux-charcoal text-lux-white rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-lux-gray">
                  Page {pagination.page} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.min(totalPages, prev.page + 1),
                    }))
                  }
                  disabled={pagination.page === totalPages}
                  className="px-4 py-2 bg-lux-charcoal text-lux-white rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Detail Panel */}
          {selectedProduct && (
            <div className="bg-lux-charcoal rounded-lg p-6 h-fit">
              <h2 className="text-2xl font-bold text-lux-gold mb-4">
                Product Details
              </h2>

              {selectedProduct.imageUrl && (
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.aiTitle}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-lux-gray">Title</label>
                  <p className="text-lux-white font-semibold">
                    {selectedProduct.aiTitle}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-lux-gray">Category</label>
                  <p className="text-lux-white">{selectedProduct.aiCategory}</p>
                </div>

                <div>
                  <label className="text-sm text-lux-gray">Condition</label>
                  <p className="text-lux-white">{selectedProduct.aiCondition}</p>
                </div>

                <div>
                  <label className="text-sm text-lux-gray">
                    Suggested Price
                  </label>
                  <p className="text-lux-gold text-2xl font-bold">
                    ${selectedProduct.suggestedPrice}
                  </p>
                  <p className="text-sm text-lux-gray">
                    Range: ${selectedProduct.priceLowRange} - $
                    {selectedProduct.priceHighRange}
                  </p>
                  <p className="text-sm text-lux-gray">
                    Confidence: {selectedProduct.priceConfidence}%
                  </p>
                </div>

                <div>
                  <label className="text-sm text-lux-gray">Description</label>
                  <p className="text-lux-white text-sm leading-relaxed">
                    {selectedProduct.aiDescription}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedProduct.status === "PENDING" && (
                <PriceReviewPanel
                  product={selectedProduct}
                  onApprove={approveProduct}
                  onReject={rejectProduct}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface PriceReviewPanelProps {
  product: AIProduct;
  onApprove: (productId: string, price: number) => Promise<void>;
  onReject: (productId: string, reason: string) => Promise<void>;
}

function PriceReviewPanel({
  product,
  onApprove,
  onReject,
}: PriceReviewPanelProps) {
  const [finalPrice, setFinalPrice] = useState(product.suggestedPrice);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  async function handleApprove() {
    setIsApproving(true);
    try {
      await onApprove(product.id, finalPrice);
    } finally {
      setIsApproving(false);
    }
  }

  async function handleReject() {
    setIsRejecting(true);
    try {
      await onReject(product.id, rejectionReason);
    } finally {
      setIsRejecting(false);
    }
  }

  return (
    <div className="mt-6">
      <div className="mb-4">
        <label className="text-sm text-lux-gray">Final Price</label>
        <input
          type="number"
          value={finalPrice}
          onChange={(e) => setFinalPrice(Number(e.target.value))}
          className="w-full bg-lux-charcoal text-lux-white px-3 py-2 rounded border border-lux-gold"
        />
      </div>

      <div className="mb-4">
        <label className="text-sm text-lux-gray">Rejection Reason</label>
        <textarea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          className="w-full bg-lux-charcoal text-lux-white px-3 py-2 rounded border border-lux-gold"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleApprove}
          disabled={isApproving}
          className="px-6 py-2 bg-lux-gold text-lux-carbon rounded-lg font-semibold disabled:opacity-50"
        >
          {isApproving ? "Approving..." : "Approve"}
        </button>
        <button
          onClick={handleReject}
          disabled={isRejecting}
          className="px-6 py-2 bg-red-900/30 text-red-200 rounded-lg font-semibold disabled:opacity-50"
        >
          {isRejecting ? "Rejecting..." : "Reject"}
        </button>
      </div>
    </div>
  );
}

