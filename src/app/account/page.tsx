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
  Package,
  ShoppingBag,
} from "lucide-react";
import { formatUSD } from "@/lib/currency";

interface WishlistItem {
  id: string;
  productId: string;
  Product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    Image: { url: string }[];
    Category: { name: string };
    status: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  OrderItem: {
    id: string;
    title: string;
    price: number;
    quantity: number;
  }[];
}

type Tab = "profile" | "orders" | "wishlist" | "settings";

const tabs = [
  { id: "profile" as Tab, label: "Profile", icon: User },
  { id: "orders" as Tab, label: "Orders", icon: Receipt },
  { id: "wishlist" as Tab, label: "Wishlist", icon: Heart },
  { id: "settings" as Tab, label: "Settings", icon: SettingsIcon },
];

export default function AccountPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    name: string | null;
    email: string;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zipCode: string | null;
    country?: string | null;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(true);

  // Modal States
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

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/account/profile");
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
        setProfileForm({
          name: data.name || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          zipCode: data.zipCode || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchData = async () => {
    try {
      const [wishlistRes, ordersRes, profileRes] = await Promise.all([
        fetch("/api/wishlist"),
        fetch("/api/orders"),
        fetch("/api/account/profile"),
      ]);

      if (wishlistRes.ok) {
        const wishlistData = await wishlistRes.json();
        setWishlist(wishlistData);
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setUserProfile(profileData);
        setProfileForm({
          name: profileData.name || "",
          phone: profileData.phone || "",
          address: profileData.address || "",
          city: profileData.city || "",
          state: profileData.state || "",
          zipCode: profileData.zipCode || "",
        });
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
      name: userProfile?.name || session?.user?.name || "",
      phone: userProfile?.phone || "",
      address: userProfile?.address || "",
      city: userProfile?.city || "",
      state: userProfile?.state || "",
      zipCode: userProfile?.zipCode || "",
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
        await fetchUserProfile();
        const updatedName = profileForm.name || userProfile?.name || "";
        await update({ user: { name: updatedName } });
        setProfileMessage({ type: "success", text: "Profile updated successfully!" });
        setTimeout(() => {
          setShowEditProfile(false);
        }, 1000);
      } else {
        const data = await response.json();
        setProfileMessage({ type: "error", text: data.error || "Failed to update profile" });
      }
    } catch {
      setProfileMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleSavePassword = async () => {
    if (passwordForm.newPassword.length < 8) {
      setPasswordMessage({ type: "error", text: "New password must be at least 8 characters" });
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
        setPasswordMessage({ type: "success", text: "Password changed successfully!" });
        setTimeout(() => setShowChangePassword(false), 1500);
      } else {
        const data = await response.json();
        setPasswordMessage({ type: "error", text: data.error || "Failed to change password" });
      }
    } catch {
      setPasswordMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setPasswordSaving(false);
    }
  };

  if (!mounted || status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-lux-pearl">
        <div className="container mx-auto py-20 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-lux-gold border-t-transparent" />
          <p className="mt-4 text-lux-gray-dark">Loading your account...</p>
        </div>
      </main>
    );
  }

  if (!session) return null;

  return (
    <main className="min-h-screen bg-lux-pearl">
      {/* Header */}
      <section className="bg-lux-cream section-normal border-b border-lux-silver-soft">
        <div className="container mx-auto">
          <p className="text-label text-lux-gold mb-2">Account</p>
          <h1 className="heading-page text-lux-black">
            Welcome back, {userProfile?.name?.split(" ")[0] || session.user?.name?.split(" ")[0] || "Collector"}
          </h1>
          <p className="lead mt-4">Manage your profile, orders, and saved items.</p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-lux-pearl py-6 border-b border-lux-silver-soft">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-lux-white rounded-lg p-4 border border-lux-silver-soft">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-lux-gold" />
                <div>
                  <p className="text-2xl font-serif font-semibold text-lux-black">{orders.length}</p>
                  <p className="text-lux-gray-dark">Orders</p>
                </div>
              </div>
            </div>
            <div className="bg-lux-white rounded-lg p-4 border border-lux-silver-soft">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-lux-gold" />
                <div>
                  <p className="text-2xl font-serif font-semibold text-lux-black">{wishlist.length}</p>
                  <p className="text-lux-gray-dark">Wishlist</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-normal">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-[250px_1fr] gap-8">
            {/* Sidebar Navigation */}
            <aside>
              <nav className="bg-lux-white rounded-lg border border-lux-silver-soft p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                      activeTab === tab.id
                        ? "bg-lux-cream text-lux-gold font-medium"
                        : "text-lux-gray-dark hover:bg-lux-pearl"
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                ))}
                <hr className="my-2 border-lux-silver-soft" />
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </nav>
            </aside>

            {/* Content Area */}
            <div className="bg-lux-white rounded-lg border border-lux-silver-soft p-6">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div>
                  <h2 className="heading-section text-lux-black mb-6">Profile Information</h2>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-label text-lux-gray-dark mb-1">Name</p>
                        <p className="text-lux-black">{userProfile?.name || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-label text-lux-gray-dark mb-1">Email</p>
                        <p className="text-lux-black">{session.user?.email}</p>
                      </div>
                    </div>
                    <div className="pt-4 flex gap-4">
                      <button onClick={handleEditProfile} className="btn-primary rounded-lg">
                        Edit Profile
                      </button>
                      <button
                        onClick={() => setShowChangePassword(true)}
                        className="btn-secondary rounded-lg"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div>
                  <h2 className="heading-section text-lux-black mb-6">Order History</h2>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="h-12 w-12 text-lux-gray-dark mx-auto mb-4" />
                      <p className="text-lux-gray-dark mb-4">No orders yet</p>
                      <Link href="/browse" className="btn-primary rounded-full">
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-lux-silver-soft rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-label text-lux-gold">Order #{order.orderNumber}</p>
                              <p className="text-lux-gray-dark" suppressHydrationWarning>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-lux-cream text-lux-gold text-xs font-medium rounded-full">
                              {order.status}
                            </span>
                          </div>
                          <p className="text-lg font-semibold text-lux-black">
                            {formatUSD(order.total)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === "wishlist" && (
                <div>
                  <h2 className="heading-section text-lux-black mb-6">Saved Items</h2>
                  {wishlist.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="h-12 w-12 text-lux-gray-dark mx-auto mb-4" />
                      <p className="text-lux-gray-dark mb-4">No saved items yet</p>
                      <Link href="/browse" className="btn-primary rounded-full">
                        Browse Collection
                      </Link>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {wishlist.map((item) => (
                        <div
                          key={item.id}
                          className="border border-lux-silver-soft rounded-lg overflow-hidden"
                        >
                          <Link href={`/product/${item.Product.slug}`}>
                            <div className="aspect-square relative bg-lux-pearl">
                              <Image
                                src={item.Product.Image[0]?.url || "/placeholder.svg"}
                                alt={item.Product.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </Link>
                          <div className="p-4">
                            <Link href={`/product/${item.Product.slug}`}>
                              <h3 className="font-medium text-lux-black hover:text-lux-gold line-clamp-1">
                                {item.Product.title}
                              </h3>
                            </Link>
                            <p className="text-lg font-semibold text-lux-gold mt-1">
                              {formatUSD(item.Product.price)}
                            </p>
                            <button
                              onClick={() => removeFromWishlist(item.productId)}
                              className="text-sm text-red-600 hover:underline mt-2"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div>
                  <h2 className="heading-section text-lux-black mb-6">Preferences</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-lux-black">Email Notifications</p>
                        <p className="text-lux-gray-dark">Receive updates about your orders</p>
                      </div>
                      <button
                        onClick={() => setEmailNotifications(!emailNotifications)}
                        aria-label={emailNotifications ? "Disable email notifications" : "Enable email notifications"}
                        className={`w-12 h-6 rounded-full transition ${
                          emailNotifications ? "bg-lux-gold" : "bg-lux-gray-light"
                        }`}
                      >
                        <span
                          className={`block w-5 h-5 bg-white rounded-full shadow transform transition ${
                            emailNotifications ? "translate-x-6" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-lux-black">Newsletter</p>
                        <p className="text-lux-gray-dark">Get updates on new arrivals</p>
                      </div>
                      <button
                        onClick={() => setNewsletterSubscribed(!newsletterSubscribed)}
                        aria-label={newsletterSubscribed ? "Unsubscribe from newsletter" : "Subscribe to newsletter"}
                        className={`w-12 h-6 rounded-full transition ${
                          newsletterSubscribed ? "bg-lux-gold" : "bg-lux-gray-light"
                        }`}
                      >
                        <span
                          className={`block w-5 h-5 bg-white rounded-full shadow transform transition ${
                            newsletterSubscribed ? "translate-x-6" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-lux-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-subsection">Edit Profile</h2>
              <button onClick={() => setShowEditProfile(false)} aria-label="Close edit profile modal" className="text-lux-gray hover:text-lux-black">
                <X className="h-5 w-5" />
              </button>
            </div>

            {profileMessage && (
              <div className={`mb-4 flex items-center gap-2 rounded-lg p-3 ${
                profileMessage.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}>
                {profileMessage.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                {profileMessage.text}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="profile-name" className="text-label text-lux-gray-dark block mb-1">Name</label>
                <input
                  id="profile-name"
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  autoComplete="name"
                  className="w-full px-4 py-2 border border-lux-silver-soft rounded-lg focus:outline-none focus:ring-2 focus:ring-lux-gold"
                />
              </div>
              <div>
                <label htmlFor="profile-phone" className="text-label text-lux-gray-dark block mb-1">Phone</label>
                <input
                  id="profile-phone"
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  autoComplete="tel"
                  className="w-full px-4 py-2 border border-lux-silver-soft rounded-lg focus:outline-none focus:ring-2 focus:ring-lux-gold"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowEditProfile(false)} className="btn-secondary rounded-lg">
                Cancel
              </button>
              <button onClick={handleSaveProfile} disabled={profileSaving} className="btn-primary rounded-lg">
                {profileSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-lux-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-subsection">Change Password</h2>
              <button onClick={() => setShowChangePassword(false)} aria-label="Close change password modal" className="text-lux-gray hover:text-lux-black">
                <X className="h-5 w-5" />
              </button>
            </div>

            {passwordMessage && (
              <div className={`mb-4 flex items-center gap-2 rounded-lg p-3 ${
                passwordMessage.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}>
                {passwordMessage.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                {passwordMessage.text}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="current-password" className="text-label text-lux-gray-dark block mb-1">Current Password</label>
                <div className="relative">
                  <input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    autoComplete="current-password"
                    className="w-full px-4 py-2 pr-10 border border-lux-silver-soft rounded-lg focus:outline-none focus:ring-2 focus:ring-lux-gold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-lux-gray"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-label text-lux-gray-dark block mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    autoComplete="new-password"
                    className="w-full px-4 py-2 pr-10 border border-lux-silver-soft rounded-lg focus:outline-none focus:ring-2 focus:ring-lux-gold"
                    placeholder="At least 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-lux-gray"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirm-password" className="text-label text-lux-gray-dark block mb-1">Confirm New Password</label>
                <input
                  id="confirm-password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  autoComplete="new-password"
                  className="w-full px-4 py-2 border border-lux-silver-soft rounded-lg focus:outline-none focus:ring-2 focus:ring-lux-gold"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowChangePassword(false)} className="btn-secondary rounded-lg">
                Cancel
              </button>
              <button onClick={handleSavePassword} disabled={passwordSaving} className="btn-primary rounded-lg">
                {passwordSaving ? "Saving..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
