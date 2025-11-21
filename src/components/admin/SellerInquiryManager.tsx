"use client";

/**
 * Seller Inquiry Manager Component
 * Phase 6 Step 5 - Seller inquiry tracking and consignment management
 */

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Calendar,
  Filter,
  Search,
} from "lucide-react";

interface SellerInquiry {
  id: string;
  sellerName: string;
  email: string;
  phone: string;
  inquiryType: "consignment" | "direct-sale" | "appraisal" | "general";
  status: "pending" | "reviewing" | "approved" | "rejected" | "completed";
  itemDescription: string;
  category: string;
  estimatedValue: number;
  images: string[];
  submittedAt: string;
  notes: string;
  adminNotes: string[];
}

export function SellerInquiryManager() {
  const [inquiries, setInquiries] = useState<SellerInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<SellerInquiry | null>(
    null,
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/sellers/inquiries");
      if (response.ok) {
        const data = await response.json();
        setInquiries(data.inquiries);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (inquiryId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `/api/admin/sellers/inquiries/${inquiryId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (response.ok) {
        await fetchInquiries();
        if (selectedInquiry?.id === inquiryId) {
          const updated = inquiries.find((i) => i.id === inquiryId);
          if (updated)
            setSelectedInquiry({ ...updated, status: newStatus as any });
        }
      }
    } catch (error) {
      console.error("Error updating inquiry:", error);
    }
  };

  const addAdminNote = async () => {
    if (!selectedInquiry || !newNote.trim()) return;

    try {
      const response = await fetch(
        `/api/admin/sellers/inquiries/${selectedInquiry.id}/notes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ note: newNote }),
        },
      );

      if (response.ok) {
        const updated = {
          ...selectedInquiry,
          adminNotes: [...selectedInquiry.adminNotes, newNote],
        };
        setSelectedInquiry(updated);
        setNewNote("");
        await fetchInquiries();
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const sendEmail = async (inquiryId: string, template: string) => {
    try {
      await fetch(`/api/admin/sellers/inquiries/${inquiryId}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template }),
      });
      alert("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesStatus =
      statusFilter === "all" || inquiry.status === statusFilter;
    const matchesType =
      typeFilter === "all" || inquiry.inquiryType === typeFilter;
    const matchesSearch =
      searchQuery === "" ||
      inquiry.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.itemDescription.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesType && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      reviewing: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      completed: "bg-surface-100 text-ink-800",
    };
    return colors[status as keyof typeof colors] || "bg-surface-100 text-ink-800";
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      reviewing: <MessageSquare className="w-4 h-4" />,
      approved: <CheckCircle className="w-4 h-4" />,
      rejected: <XCircle className="w-4 h-4" />,
      completed: <Package className="w-4 h-4" />,
    };
    return icons[status as keyof typeof icons] || <Clock className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="bg-surface-0 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-ink-900 mb-6">
          Seller Inquiries & Consignments
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search sellers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <label htmlFor="status-filter" className="sr-only">
              Filter by status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label htmlFor="type-filter" className="sr-only">
              Filter by type
            </label>
            <select
              id="type-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-border-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="consignment">Consignment</option>
              <option value="direct-sale">Direct Sale</option>
              <option value="appraisal">Appraisal</option>
              <option value="general">General Inquiry</option>
            </select>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center bg-amber-50 rounded-lg px-4 py-2">
            <span className="text-sm text-ink-600">Total: </span>
            <span className="ml-2 text-xl font-bold text-amber-600">
              {filteredInquiries.length}
            </span>
          </div>
        </div>
      </div>

      {/* Inquiries Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inquiries List */}
        <div className="space-y-4">
          {filteredInquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              onClick={() => setSelectedInquiry(inquiry)}
              className={`bg-surface-0 rounded-lg shadow p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedInquiry?.id === inquiry.id
                  ? "ring-2 ring-amber-500"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-ink-900">
                    {inquiry.sellerName}
                  </h3>
                  <p className="text-sm text-ink-500">{inquiry.email}</p>
                </div>
                <span
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}
                >
                  {getStatusIcon(inquiry.status)}
                  {inquiry.status}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-ink-600">
                  <Package className="w-4 h-4" />
                  <span className="capitalize">
                    {inquiry.inquiryType.replace("-", " ")}
                  </span>
                </div>
                <p className="text-sm text-ink-700 line-clamp-2">
                  {inquiry.itemDescription}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-500">{inquiry.category}</span>
                  <span className="font-semibold text-amber-600">
                    ${inquiry.estimatedValue.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-ink-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(inquiry.submittedAt).toLocaleDateString()}
                </span>
                <span>{inquiry.adminNotes.length} notes</span>
              </div>
            </div>
          ))}

          {filteredInquiries.length === 0 && (
            <div className="bg-surface-0 rounded-lg shadow p-8 text-center text-ink-500">
              No inquiries found matching your filters
            </div>
          )}
        </div>

        {/* Inquiry Details Panel */}
        {selectedInquiry ? (
          <div className="bg-surface-0 rounded-lg shadow p-6 space-y-6 lg:sticky lg:top-4 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
            <div>
              <h3 className="text-xl font-bold text-ink-900 mb-4">
                Inquiry Details
              </h3>

              {/* Seller Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-ink-500">Seller Name</p>
                    <p className="font-medium">{selectedInquiry.sellerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-ink-500">Email</p>
                    <p className="font-medium">{selectedInquiry.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-ink-500">Phone</p>
                    <p className="font-medium">{selectedInquiry.phone}</p>
                  </div>
                </div>
              </div>

              {/* Item Details */}
              <div className="mb-6">
                <h4 className="font-semibold text-ink-900 mb-3">
                  Item Information
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-ink-600">Type:</span>
                    <span className="font-medium capitalize">
                      {selectedInquiry.inquiryType.replace("-", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-600">Category:</span>
                    <span className="font-medium">
                      {selectedInquiry.category}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-600">Estimated Value:</span>
                    <span className="font-semibold text-amber-600">
                      ${selectedInquiry.estimatedValue.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-ink-600 mb-1">Description:</p>
                  <p className="text-ink-900">
                    {selectedInquiry.itemDescription}
                  </p>
                </div>
              </div>

              {/* Status Actions */}
              <div className="mb-6">
                <h4 className="font-semibold text-ink-900 mb-3">
                  Update Status
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      updateInquiryStatus(selectedInquiry.id, "reviewing")
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Mark Reviewing
                  </button>
                  <button
                    onClick={() =>
                      updateInquiryStatus(selectedInquiry.id, "approved")
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      updateInquiryStatus(selectedInquiry.id, "rejected")
                    }
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() =>
                      updateInquiryStatus(selectedInquiry.id, "completed")
                    }
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                  >
                    Complete
                  </button>
                </div>
              </div>

              {/* Email Actions */}
              <div className="mb-6">
                <h4 className="font-semibold text-ink-900 mb-3">Send Email</h4>
                <div className="space-y-2">
                  <button
                    onClick={() =>
                      sendEmail(selectedInquiry.id, "acknowledgment")
                    }
                    className="w-full px-4 py-2 border border-border-300 rounded-lg hover:bg-surface-50 text-sm"
                  >
                    Send Acknowledgment
                  </button>
                  <button
                    onClick={() => sendEmail(selectedInquiry.id, "approval")}
                    className="w-full px-4 py-2 border border-border-300 rounded-lg hover:bg-surface-50 text-sm"
                  >
                    Send Approval Email
                  </button>
                  <button
                    onClick={() => sendEmail(selectedInquiry.id, "rejection")}
                    className="w-full px-4 py-2 border border-border-300 rounded-lg hover:bg-surface-50 text-sm"
                  >
                    Send Rejection Email
                  </button>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <h4 className="font-semibold text-ink-900 mb-3">
                  Admin Notes
                </h4>
                <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                  {selectedInquiry.adminNotes.map((note, index) => (
                    <div key={index} className="bg-surface-50 rounded p-2 text-sm">
                      {note}
                    </div>
                  ))}
                  {selectedInquiry.adminNotes.length === 0 && (
                    <p className="text-sm text-ink-500 italic">No notes yet</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-1 px-3 py-2 border border-border-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <button
                    onClick={addAdminNote}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-surface-0 rounded-lg shadow p-8 text-center text-ink-500 lg:sticky lg:top-4">
            Select an inquiry to view details
          </div>
        )}
      </div>
    </div>
  );
}

