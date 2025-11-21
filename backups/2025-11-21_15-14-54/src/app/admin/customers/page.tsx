"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { TrendingUp } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate?: string;
}

export default function AdminCustomersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "spent" | "orders" | "joined">(
    "joined",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchCustomers();
    }
  }, [status, session]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/admin/customers");
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
        setFilteredCustomers(data);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...customers];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (customer) =>
          customer.name.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          (customer.phone?.includes(query) ?? false),
      );
    }

    // Sorting
    result.sort((a, b) => {
      let compareValue = 0;
      switch (sortBy) {
        case "name":
          compareValue = a.name.localeCompare(b.name);
          break;
        case "spent":
          compareValue = a.totalSpent - b.totalSpent;
          break;
        case "orders":
          compareValue = a.orderCount - b.orderCount;
          break;
        case "joined":
          compareValue =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortOrder === "asc" ? compareValue : -compareValue;
    });

    setFilteredCustomers(result);
  }, [customers, searchQuery, sortBy, sortOrder]);

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session || session.user?.role !== "admin") {
    return null;
  }

  const stats = {
    total: customers.length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    averageSpent:
      customers.length > 0
        ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length
        : 0,
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-header">
        <div className="container">
          <div className="admin-header-content">
            <div>
              <h1 className="admin-title">Customer Management</h1>
              <p className="admin-subtitle">View and manage all customers</p>
            </div>
            <Link href="/admin/dashboard" className="btn-secondary">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-content">
        <div className="container">
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="stat-icon bg-blue-100">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-blue-800"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Total Customers</p>
                <p className="stat-value">{stats.total}</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-icon bg-emerald-100">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-emerald-700"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  <path d="M12 4v8l6.59 3.95" />
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Total Revenue</p>
                <p className="stat-value">
                  $
                  {stats.totalRevenue.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-icon bg-amber-100">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-amber-900"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11.5 1H8.3c-.8 0-1.5.7-1.5 1.5v12c0 .8.7 1.5 1.5 1.5h8.4c.8 0 1.5-.7 1.5-1.5V10" />
                  <path d="M11 7h4" />
                  <path d="M11 11h4" />
                  <path d="M20.4 1v6h6" />
                  <path d="M21 7l5-5" />
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Average Spent</p>
                <p className="stat-value">
                  $
                  {stats.averageSpent.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Search & Sort */}
          <div className="admin-filters">
            <div className="admin-search">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                aria-label="Search customers"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-search-input"
              />
            </div>

            <div className="admin-filter-group">
              <label htmlFor="sort-select">Sort By:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => handleSort(e.target.value as typeof sortBy)}
                className="admin-select"
              >
                <option value="joined">Join Date</option>
                <option value="name">Name</option>
                <option value="spent">Total Spent</option>
                <option value="orders">Order Count</option>
              </select>
            </div>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="btn-secondary flex items-center gap-2"
              title={`Sort ${sortOrder === "asc" ? "ascending" : "descending"}`}
            >
              <TrendingUp width={18} height={18} />
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>

          {/* Customers Table */}
          <div className="admin-table-container">
            {filteredCustomers.length === 0 ? (
              <div className="admin-empty-state">
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <h3>No Customers Found</h3>
                <p>
                  {searchQuery
                    ? "Try adjusting your search"
                    : "Customers will appear here once they create accounts"}
                </p>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>
                      <button
                        onClick={() => handleSort("name")}
                        className="sort-button"
                      >
                        Name{" "}
                        {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                      </button>
                    </th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>
                      <button
                        onClick={() => handleSort("orders")}
                        className="sort-button"
                      >
                        Orders{" "}
                        {sortBy === "orders" &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </button>
                    </th>
                    <th>
                      <button
                        onClick={() => handleSort("spent")}
                        className="sort-button"
                      >
                        Total Spent{" "}
                        {sortBy === "spent" &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </button>
                    </th>
                    <th>Last Order</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td>
                        <span className="font-medium text-ink">
                          {customer.name}
                        </span>
                      </td>
                      <td>
                        <span className="text-ink-secondary">
                          {customer.email}
                        </span>
                      </td>
                      <td>
                        <span className="text-ink-secondary">
                          {customer.phone || "—"}
                        </span>
                      </td>
                      <td>
                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                          {customer.orderCount}
                        </span>
                      </td>
                      <td>
                        <span className="font-semibold text-ink">
                          $
                          {customer.totalSpent.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </td>
                      <td>
                        <span className="text-ink-secondary">
                          {customer.lastOrderDate
                            ? new Date(
                                customer.lastOrderDate,
                              ).toLocaleDateString()
                            : "—"}
                        </span>
                      </td>
                      <td>
                        <span className="text-ink-secondary text-sm">
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

