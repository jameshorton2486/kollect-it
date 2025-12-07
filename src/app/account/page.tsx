"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Receipt,
  Heart,
  Settings as SettingsIcon,
  LogOut,
  X,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import { formatUSD } from "@/lib/currency";

interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    images: { url: string }[];
    category: { name: string };
    status: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: {
    id: string;
    title: string;
    price: number;
    quantity: number;
  }[];
}

type Tab = "profile" | "orders" | "wishlist" | "settings";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(true);

  // Edit Profile Modal State
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Change Password Modal State
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchData();
    }
  }, [status, router]);

  const fetchData = async () => {
    try {
      const [wishlistRes, ordersRes] = await Promise.all([
        fetch("/api/wishlist"),
        fetch("/api/orders"),
      ]);

      if (wishlistRes.ok) {
        const wishlistData = await wishlistRes.json();
        setWishlist(wishlistData);
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        setWishlist(wishlist.filter((item) => item.productId !== productId));
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const handleEditProfile = () => {
    setProfileForm({
      name: session?.user?.name || "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    });
    setProfileMessage(null);
    setShowEditProfile(true);
  };

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    setProfileMessage(null);

    try {
      const response = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });

      if (response.ok) {
        setProfileMessage({
          type: "success",
          text: "Profile updated successfully!",
        });
        setTimeout(() => {
          setShowEditProfile(false);
          window.location.reload();
        }, 1500);
      } else {
        const data = await response.json();
        setProfileMessage({
          type: "error",
          text: data.error || "Failed to update profile",
        });
      }
    } catch (error) {
      setProfileMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordMessage(null);
    setShowChangePassword(true);
  };

  const handleSavePassword = async () => {
    if (passwordForm.newPassword.length < 8) {
      setPasswordMessage({
        type: "error",
        text: "New password must be at least 8 characters",
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    setPasswordSaving(true);
    setPasswordMessage(null);

    try {
      const response = await fetch("/api/account/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (response.ok) {
        setPasswordMessage({
          type: "success",
          text: "Password changed successfully!",
        });
        setTimeout(() => {
          setShowChangePassword(false);
        }, 1500);
      } else {
        const data = await response.json();
        setPasswordMessage({
          type: "error",
          text: data.error || "Failed to change password",
        });
      }
    } catch (error) {
      setPasswordMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setPasswordSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="account-page">
      {/* Header */}
      <div className="border-b border-border-300 bg-surface-0">
        <div className="container py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-serif text-[42px] leading-tight text-ink">
                My Account
              </h1>
              <p className="text-[14px] text-ink-700">
                Welcome back, {session.user?.name}!
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="inline-flex items-center gap-2 rounded border border-border-300 px-3 py-2 text-[14px] text-ink-700 hover:bg-cream"
              aria-label="Sign out"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border-300 bg-surface-0">
        <div className="container">
          <div className="py-3 md:hidden">
            <label htmlFor="account-tab" className="sr-only">
              Choose section
            </label>
            <select
              id="account-tab"
              className="form-input w-full"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as Tab)}
            >
              <option value="profile">Profile</option>
              <option value="orders">Orders</option>
              <option value="wishlist">Wishlist</option>
              <option value="settings">Settings</option>
            </select>
          </div>
          <div
            className="hidden items-stretch gap-8 md:flex"
            role="tablist"
            aria-label="Account sections"
          >
            {(
              [
                { key: "profile", label: "Profile", icon: User },
                {
                  key: "orders",
                  label: `Orders (${orders.length})`,
                  icon: Receipt,
                },
                {
                  key: "wishlist",
                  label: `Wishlist (${wishlist.length})`,
                  icon: Heart,
                },
                { key: "settings", label: "Settings", icon: SettingsIcon },
              ] as Array<{
                key: Tab;
                label: string;
                icon: React.ComponentType<{ size?: number }>;
              }>
            ).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                className={`relative -mb-px inline-flex items-center gap-2 border-b-4 px-1 py-4 text-[14px] ${
                  activeTab === key
                    ? "border-gold-500 text-ink-900"
                    : "border-transparent text-ink-700 hover:text-ink-900"
                }`}
                onClick={() => setActiveTab(key)}
                role="tab"
                id={`tab-${key}`}
                aria-controls={`panel-${key}`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="ki-section">
        <div className="container mx-auto">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div
              className="rounded-lg border border-border-300 bg-surface-0 p-6"
              role="tabpanel"
              id="panel-profile"
              aria-labelledby="tab-profile"
            >
              <h2 className="mb-4 font-serif text-2xl">Profile Information</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between rounded border border-border-300 p-3">
                  <span className="text-[12px] uppercase tracking-wide text-ink-700">
                    Name
                  </span>
                  <span className="font-medium">
                    {session.user?.name || "Not set"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded border border-border-300 p-3">
                  <span className="text-[12px] uppercase tracking-wide text-ink-700">
                    Email
                  </span>
                  <span className="font-medium">{session.user?.email}</span>
                </div>
                <div className="flex items-center justify-between rounded border border-border-300 p-3">
                  <span className="text-[12px] uppercase tracking-wide text-ink-700">
                    Phone
                  </span>
                  <span className="font-medium">Not set</span>
                </div>
                <div className="flex items-center justify-between rounded border border-border-300 p-3">
                  <span className="text-[12px] uppercase tracking-wide text-ink-700">
                    Account Type
                  </span>
                  <span className="font-medium">
                    {(session.user as { role?: string } | undefined)?.role ===
                    "admin"
                      ? "Administrator"
                      : "Customer"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded border border-border-300 p-3">
                  <span className="text-[12px] uppercase tracking-wide text-ink-700">
                    Default Shipping
                  </span>
                  <span className="font-medium">Not set</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleEditProfile}
                  className="ki-btn-primary"
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  onClick={handleChangePassword}
                  className="inline-flex items-center justify-center rounded border border-border-300 px-4 py-2 text-[14px] text-ink-900 hover:bg-cream"
                >
                  Change Password
                </button>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div
              className="rounded-lg border border-border-300 bg-surface-0 p-6"
              role="tabpanel"
              id="panel-orders"
              aria-labelledby="tab-orders"
            >
              <h2 className="mb-4 font-serif text-2xl">Order History</h2>
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded border border-border-300 bg-cream p-8 text-center">
                  <Receipt className="text-ink-700" size={48} />
                  <h3 className="font-serif text-xl">No Orders Yet</h3>
                  <p className="text-ink-700">
                    You haven&apos;t placed any orders yet.
                  </p>
                  <Link href="/" className="ki-btn-primary">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border-300">
                  {orders.map((order) => {
                    const statusClass =
                      order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : order.status === "processing" ||
                              order.status === "paid"
                            ? "bg-[rgba(199,168,94,0.15)] text-ink-900"
                            : "bg-surface-100 text-ink-800";
                    return (
                      <div
                        key={order.id}
                        className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between"
                      >
                        <div className="flex flex-col">
                          <Link
                            href={`/account/orders/${order.id}`}
                            className="font-medium underline"
                          >
                            Order #{order.orderNumber}
                          </Link>
                          <span className="text-[12px] text-ink-700">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center md:justify-end">
                          <span className="text-[14px] text-ink-700">
                            Items: {order.items?.length ?? 0}
                          </span>
                          <span
                            className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-[12px] ${statusClass}`}
                          >
                            {order.status}
                          </span>
                          <span className="font-semibold">
                            Total: {formatUSD(order.total)}
                          </span>
                          <Link
                            href={`/account/orders/${order.id}`}
                            className="underline"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === "wishlist" && (
            <div
              className="rounded-lg border border-border-300 bg-surface-0 p-6"
              role="tabpanel"
              id="panel-wishlist"
              aria-labelledby="tab-wishlist"
            >
              <h2 className="mb-4 font-serif text-2xl">My Wishlist</h2>
              {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded border border-border-300 bg-cream p-8 text-center">
                  <Heart className="text-ink-700" size={48} />
                  <h3 className="font-serif text-xl">No Wishlist Items</h3>
                  <p className="text-ink-700">
                    Save items you love to your wishlist.
                  </p>
                  <Link href="/" className="ki-btn-primary">
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {wishlist.map((item) => (
                    <div
                      key={item.id}
                      className="group rounded-lg border border-border-300 bg-surface-0 p-3"
                    >
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="block overflow-hidden rounded"
                      >
                        {item.product.images[0] ? (
                          <Image
                            src={item.product.images[0].url}
                            alt={item.product.title}
                            width={400}
                            height={400}
                            className="h-auto w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                          />
                        ) : (
                          <div className="flex h-[200px] items-center justify-center bg-cream text-ink-700">
                            No Image
                          </div>
                        )}
                      </Link>
                      <div className="mt-3 flex flex-col gap-1">
                        <span className="text-[12px] uppercase tracking-wide text-ink-700">
                          {item.product.category.name}
                        </span>
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="font-medium hover:text-gold-500"
                        >
                          {item.product.title}
                        </Link>
                        <span className="text-gold font-semibold">
                          {formatUSD(item.product.price)}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <button
                          onClick={() => removeFromWishlist(item.productId)}
                          className="inline-flex items-center gap-2 rounded border border-border-300 px-3 py-2 text-[14px] hover:bg-cream"
                          aria-label="Remove from wishlist"
                        >
                          <Heart size={16} />
                          Remove
                        </button>
                        <AddToCartButton
                          product={{
                            id: item.product.id,
                            title: item.product.title,
                            price: item.product.price,
                            slug: item.product.slug,
                            image:
                              item.product.images[0]?.url || "/placeholder.svg",
                            categoryName: item.product.category.name,
                          }}
                          quantity={1}
                          className="ki-btn-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div
              className="rounded-lg border border-border-300 bg-surface-0 p-6"
              role="tabpanel"
              id="panel-settings"
              aria-labelledby="tab-settings"
            >
              <h2 className="mb-4 font-serif text-2xl">Settings</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between rounded border border-border-300 p-3">
                  <div>
                    <span className="block font-medium">
                      Email Notifications
                    </span>
                    <span className="text-[13px] text-ink-700">
                      Order updates and account alerts
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    aria-label="Toggle email notifications"
                    className="h-5 w-5"
                  />
                </label>

                <label className="flex items-center justify-between rounded border border-border-300 p-3">
                  <div>
                    <span className="block font-medium">
                      Newsletter Subscription
                    </span>
                    <span className="text-[13px] text-ink-700">
                      Occasional stories and arrivals
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={newsletterSubscribed}
                    onChange={(e) => setNewsletterSubscribed(e.target.checked)}
                    aria-label="Toggle newsletter subscription"
                    className="h-5 w-5"
                  />
                </label>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          "Are you sure you want to delete your account? This action cannot be undone."
                        )
                      ) {
                        alert("Account deletion request submitted.");
                      }
                    }}
                    className="text-[14px] text-red-600 underline"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-2xl">Edit Profile</h2>
              <button
                type="button"
                onClick={() => setShowEditProfile(false)}
                className="rounded p-1 hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {profileMessage && (
              <div
                className={`mb-4 flex items-center gap-2 rounded p-3 ${
                  profileMessage.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {profileMessage.type === "success" ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}
                {profileMessage.text}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="profile-name"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label
                  htmlFor="profile-phone"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Phone
                </label>
                <input
                  id="profile-phone"
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phone: e.target.value })
                  }
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="(555) 555-5555"
                />
              </div>
              <div>
                <label
                  htmlFor="profile-address"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  id="profile-address"
                  type="text"
                  value={profileForm.address}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, address: e.target.value })
                  }
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="profile-city"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <input
                    id="profile-city"
                    type="text"
                    value={profileForm.city}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, city: e.target.value })
                    }
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="profile-state"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    State
                  </label>
                  <input
                    id="profile-state"
                    type="text"
                    value={profileForm.state}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, state: e.target.value })
                    }
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="profile-zip"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  ZIP Code
                </label>
                <input
                  id="profile-zip"
                  type="text"
                  value={profileForm.zipCode}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, zipCode: e.target.value })
                  }
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowEditProfile(false)}
                className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={profileSaving}
                className="rounded bg-amber-600 px-4 py-2 text-sm text-white hover:bg-amber-700 disabled:opacity-50"
              >
                {profileSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-2xl">Change Password</h2>
              <button
                type="button"
                onClick={() => setShowChangePassword(false)}
                className="rounded p-1 hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {passwordMessage && (
              <div
                className={`mb-4 flex items-center gap-2 rounded p-3 ${
                  passwordMessage.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {passwordMessage.type === "success" ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}
                {passwordMessage.text}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="current-password"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Current Password
                </label>
                <div className="relative">
                  <input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 pr-10 text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="new-password"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 pr-10 text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="At least 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowChangePassword(false)}
                className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePassword}
                disabled={passwordSaving}
                className="rounded bg-amber-600 px-4 py-2 text-sm text-white hover:bg-amber-700 disabled:opacity-50"
              >
                {passwordSaving ? "Saving..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
