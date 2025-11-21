"use client";

/**
 * Enhanced Order Details Component
 * Phase 6 Step 4 - Detailed order view with timeline, bulk actions, and reporting
 */

import { useState } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  CreditCard,
} from "lucide-react";

interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  productId: string;
}

interface OrderTimeline {
  status: string;
  timestamp: string;
  note?: string;
  user?: string;
}

interface DetailedOrder {
  id: string;
  orderNumber: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  timeline: OrderTimeline[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes: string;
}

interface Props {
  order: DetailedOrder;
  onClose: () => void;
  onUpdate: (orderId: string, updates: Partial<DetailedOrder>) => void;
}

export function OrderDetailsPanel({ order, onClose, onUpdate }: Props) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState(order.status);
  const [internalNote, setInternalNote] = useState("");

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          note: internalNote,
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        onUpdate(order.id, updated);
        setInternalNote("");
      }
    } catch (error) {
      console.error("Failed to update order:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendEmail = async (
    type: "confirmation" | "shipped" | "delivered",
  ) => {
    try {
      await fetch(`/api/admin/orders/${order.id}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      alert(`${type} email sent successfully`);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="text-yellow-600" size={20} />;
      case "processing":
        return <Package className="text-blue-600" size={20} />;
      case "shipped":
        return <Truck className="text-indigo-600" size={20} />;
      case "delivered":
        return <CheckCircle className="text-green-600" size={20} />;
      case "cancelled":
        return <XCircle className="text-red-600" size={20} />;
      default:
        return <Clock className="text-ink-600" size={20} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-surface-0 shadow-2xl overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <div>
              <h2 className="text-2xl font-bold text-ink-900">
                Order {order.orderNumber}
              </h2>
              <p className="text-sm text-ink-500 mt-1">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-ink-600 text-3xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Status Update Section */}
          <div className="mb-6 p-4 bg-surface-50 rounded-lg">
            <h3 className="text-lg font-semibold text-ink-900 mb-3">
              Update Order Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="status-select"
                  className="block text-sm font-medium text-ink-700 mb-2"
                >
                  New Status
                </label>
                <select
                  id="status-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-border-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="internal-note"
                  className="block text-sm font-medium text-ink-700 mb-2"
                >
                  Internal Note (Optional)
                </label>
                <input
                  id="internal-note"
                  type="text"
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Add a note..."
                  className="w-full px-3 py-2 border border-border-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
            <button
              onClick={handleStatusUpdate}
              disabled={isUpdating || newStatus === order.status}
              className="mt-3 w-full px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isUpdating ? "Updating..." : "Update Status"}
            </button>
          </div>

          {/* Customer Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-ink-900 mb-3">
              Customer Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="text-gray-400" size={18} />
                <span className="text-ink-700">
                  {order.customerEmail || "No email"}
                </span>
              </div>
              {order.customerPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="text-gray-400" size={18} />
                  <span className="text-ink-700">{order.customerPhone}</span>
                </div>
              )}
              <div className="flex items-start gap-2 mt-3">
                <MapPin className="text-gray-400 mt-1" size={18} />
                <div className="text-ink-700">
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-ink-900 mb-3">
              Order Items
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-surface-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-ink-500 uppercase">
                      Product
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-ink-500 uppercase">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-ink-500 uppercase">
                      Price
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-ink-500 uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-surface-0 divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm text-ink-900">
                        {item.title}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-700 text-center">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-700 text-right">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-ink-900 text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Totals */}
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-600">Subtotal:</span>
                <span className="font-medium">
                  ${order.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600">Tax:</span>
                <span className="font-medium">${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600">Shipping:</span>
                <span className="font-medium">
                  ${order.shipping.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t text-lg font-bold">
                <span>Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-ink-900 mb-3">
              Payment Information
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CreditCard className="text-gray-400" size={18} />
                <span className="text-ink-700 capitalize">
                  {order.paymentMethod}
                </span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.paymentStatus === "paid"
                    ? "bg-green-100 text-green-800"
                    : order.paymentStatus === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {order.paymentStatus.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-ink-900 mb-3">
              Order Timeline
            </h3>
            <div className="space-y-4">
              {order.timeline.map((event, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    {getStatusIcon(event.status)}
                    {index < order.timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-surface-200 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-ink-900 capitalize">
                        {event.status}
                      </span>
                      <span className="text-xs text-ink-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {event.note && (
                      <p className="text-sm text-ink-600 mt-1">{event.note}</p>
                    )}
                    {event.user && (
                      <p className="text-xs text-ink-500 mt-1">
                        By {event.user}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Email Actions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-ink-900 mb-3">
              Send Email
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => handleSendEmail("confirmation")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Order Confirmation
              </button>
              <button
                onClick={() => handleSendEmail("shipped")}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
              >
                Shipping Notification
              </button>
              <button
                onClick={() => handleSendEmail("delivered")}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
              >
                Delivery Confirmation
              </button>
            </div>
          </div>

          {/* Internal Notes */}
          {order.notes && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-ink-900 mb-3">
                Internal Notes
              </h3>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-ink-700">{order.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

