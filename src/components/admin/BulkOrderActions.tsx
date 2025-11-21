"use client";

/**
 * Bulk Order Actions Component
 * Phase 6 Step 4 - Bulk operations for order management
 */

import { useState } from "react";
import {
  CheckSquare,
  Square,
  Download,
  Mail,
  Trash2,
  Archive,
} from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
}

interface Props {
  orders: Order[];
  selectedIds: string[];
  onSelect: (_id: string) => void;
  onSelectAll: () => void;
  onBulkAction: (action: string, orderIds: string[]) => Promise<void>;
}

export function BulkOrderActions({
  orders,
  selectedIds,
  onSelect: _onSelect,
  onSelectAll,
  onBulkAction,
}: Props) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");

  const handleBulkAction = async () => {
    if (!selectedAction || selectedIds.length === 0) return;

    const confirmMessage = `Are you sure you want to ${selectedAction} ${selectedIds.length} order(s)?`;
    if (!confirm(confirmMessage)) return;

    setIsProcessing(true);
    try {
      await onBulkAction(selectedAction, selectedIds);
      setSelectedAction("");
    } catch (error) {
      console.error("Bulk action failed:", error);
      alert("Failed to perform bulk action");
    } finally {
      setIsProcessing(false);
    }
  };

  const allSelected = orders.length > 0 && selectedIds.length === orders.length;

  return (
    <div className="bg-surface-0 border border-border-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Select All */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSelectAll}
            className="flex items-center gap-2 text-sm text-ink-700 hover:text-ink-900"
            aria-label={
              allSelected ? "Deselect all orders" : "Select all orders"
            }
          >
            {allSelected ? (
              <CheckSquare className="text-amber-600" size={20} />
            ) : (
              <Square className="text-gray-400" size={20} />
            )}
            <span className="font-medium">
              {selectedIds.length > 0
                ? `${selectedIds.length} selected`
                : "Select all"}
            </span>
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3">
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="px-3 py-2 border border-border-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-label="Select bulk action"
            >
              <option value="">Choose action...</option>
              <option value="mark-processing">Mark as Processing</option>
              <option value="mark-shipped">Mark as Shipped</option>
              <option value="mark-delivered">Mark as Delivered</option>
              <option value="send-confirmation">Send Confirmation Email</option>
              <option value="export-csv">Export to CSV</option>
              <option value="archive">Archive Orders</option>
              <option value="delete">Delete Orders</option>
            </select>

            <button
              onClick={handleBulkAction}
              disabled={!selectedAction || isProcessing}
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
            >
              {isProcessing ? "Processing..." : "Apply"}
            </button>
          </div>
        )}

        {/* Quick Action Buttons */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onBulkAction("export-csv", selectedIds)}
              className="p-2 text-ink-600 hover:text-ink-900 hover:bg-surface-100 rounded-md"
              title="Export selected orders"
              aria-label="Export selected orders to CSV"
            >
              <Download size={18} />
            </button>
            <button
              onClick={() => onBulkAction("send-email", selectedIds)}
              className="p-2 text-ink-600 hover:text-ink-900 hover:bg-surface-100 rounded-md"
              title="Send email to selected orders"
              aria-label="Send email to selected orders"
            >
              <Mail size={18} />
            </button>
            <button
              onClick={() => onBulkAction("archive", selectedIds)}
              className="p-2 text-ink-600 hover:text-ink-900 hover:bg-surface-100 rounded-md"
              title="Archive selected orders"
              aria-label="Archive selected orders"
            >
              <Archive size={18} />
            </button>
            <button
              onClick={() => onBulkAction("delete", selectedIds)}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
              title="Delete selected orders"
              aria-label="Delete selected orders"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Selection Summary */}
      {selectedIds.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border-200">
          <div className="text-sm text-ink-600">
            <span className="font-medium">{selectedIds.length}</span> order(s)
            selected
            {selectedIds.length > 1 && " · "}
            {selectedIds.length > 1 && (
              <button
                onClick={onSelectAll}
                className="text-amber-600 hover:text-amber-700 font-medium"
              >
                Clear selection
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

