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
    <div className="min-h-screen bg-[#1a1a1a] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#D3AF37] mb-2">
            Product Approval Queue
          </h1>
          <p className="text-gray-400">
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
                    ? "bg-[#D3AF37] text-[#1a1a1a]"
                    : "bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]"
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
            <div className="bg-[#2a2a2a] rounded-lg overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-gray-400">
                  <p>Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <p>No products to review</p>
                </div>
              ) : (
                <div className="divide-y divide-[#3a3a3a]">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`p-6 cursor-pointer transition-colors ${
                        selectedProduct?.id === product.id
                          ? "bg-[#3a3a3a] border-l-4 border-[#D3AF37]"
                          : "hover:bg-[#3a3a3a]"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {product.aiTitle}
                          </h3>
                          <p className="text-sm text-gray-400 mb-3">
                            {product.aiDescription.substring(0, 100)}...
                          </p>
                          <div className="flex gap-4 text-sm">
                            <span className="text-[#D3AF37]">
                              ${product.suggestedPrice}
                            </span>
                            <span className="text-gray-400">
                              {product.aiCategory}
                            </span>
                            <span className="text-gray-400">
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
                  className="px-4 py-2 bg-[#2a2a2a] text-white rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-gray-400">
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
                  className="px-4 py-2 bg-[#2a2a2a] text-white rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Detail Panel */}
          {selectedProduct && (
            <div className="bg-[#2a2a2a] rounded-lg p-6 h-fit">
              <h2 className="text-2xl font-bold text-[#D3AF37] mb-4">
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
                  <label className="text-sm text-gray-400">Title</label>
                  <p className="text-white font-semibold">
                    {selectedProduct.aiTitle}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Category</label>
                  <p className="text-white">{selectedProduct.aiCategory}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Condition</label>
                  <p className="text-white">{selectedProduct.aiCondition}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-400">
                    Suggested Price
                  </label>
                  <p className="text-[#D3AF37] text-2xl font-bold">
                    ${selectedProduct.suggestedPrice}
                  </p>
                  <p className="text-sm text-gray-400">
                    Range: ${selectedProduct.priceLowRange} - $
                    {selectedProduct.priceHighRange}
                  </p>
                  <p className="text-sm text-gray-400">
                    Confidence: {selectedProduct.priceConfidence}%
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Description</label>
                  <p className="text-white text-sm leading-relaxed">
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
      await onReject(product.id, rejectionReason || "No reason provided");
    } finally {
      setIsRejecting(false);
    }
  }

  return (
    <div className="mt-6 space-y-4 border-t border-[#3a3a3a] pt-6">
      <div>
        <label htmlFor="final-price" className="text-sm text-gray-400">
          Final Price
        </label>
        <div className="flex gap-2">
          <span className="text-[#D3AF37] self-center">$</span>
          <input
            id="final-price"
            type="number"
            value={finalPrice}
            onChange={(e) => setFinalPrice(parseFloat(e.target.value))}
            placeholder="Enter final price"
            className="flex-1 px-3 py-2 bg-[#1a1a1a] text-white rounded-lg border border-[#3a3a3a] focus:border-[#D3AF37] outline-none"
          />
        </div>
      </div>

      <button
        onClick={handleApprove}
        disabled={isApproving}
        className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
      >
        {isApproving ? "Approving..." : "Approve Product"}
      </button>

      <div>
        <label className="text-sm text-gray-400">
          Rejection Reason (optional)
        </label>
        <textarea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          className="w-full px-3 py-2 bg-[#1a1a1a] text-white rounded-lg border border-[#3a3a3a] focus:border-[#D3AF37] outline-none h-20"
          placeholder="Enter reason for rejection..."
        />
      </div>

      <button
        onClick={handleReject}
        disabled={isRejecting}
        className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
      >
        {isRejecting ? "Rejecting..." : "Reject Product"}
      </button>
    </div>
  );
}

