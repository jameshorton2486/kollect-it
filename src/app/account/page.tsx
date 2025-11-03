 'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { User, Receipt, Heart, Settings as SettingsIcon, LogOut, AlertCircle, Loader } from 'lucide-react';
import AddToCartButton from '@/components/AddToCartButton';
import { formatUSD } from '@/lib/currency';

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

type Tab = 'profile' | 'orders' | 'wishlist' | 'settings';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchData();
      if (session?.user?.name) {
        setProfileData(prev => ({
          ...prev,
          name: session.user.name || '',
        }));
      }
    }
  }, [status, router, session]);

  const fetchData = async () => {
    try {
      setError(null);
      const [wishlistRes, ordersRes] = await Promise.all([
        fetch('/api/wishlist'),
        fetch('/api/orders'),
      ]);

      if (!wishlistRes.ok || !ordersRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const wishlistData = await wishlistRes.json();
      const ordersData = await ordersRes.json();
      
      setWishlist(wishlistData);
      setOrders(ordersData);
    } catch (err) {
      setError('Failed to load your data. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        setWishlist(wishlist.filter((item) => item.productId !== productId));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        setEditingProfile(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  if (status === 'loading') {
    return (
      <main className="ki-section ki-container px-4 md:px-6 lg:px-8 py-12" role="main">
        <div className="flex items-center justify-center gap-3 py-16">
          <Loader className="animate-spin" />
          <span>Loading your account...</span>
        </div>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="ki-section ki-container px-4 md:px-6 lg:px-8 py-12" role="main">
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink mb-2">My Account</h1>
          <p className="text-ink-secondary">Welcome back, {session.user?.name}!</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border-neutral hover:bg-surface-2 transition-colors"
          aria-label="Sign out"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={() => fetchData()}
              className="text-sm text-red-600 hover:text-red-700 underline mt-1"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="mb-8">
        {/* Mobile select */}
        <div className="md:hidden mb-4">
          <label htmlFor="account-tab" className="sr-only">Choose section</label>
          <select
            id="account-tab"
            className="w-full px-4 py-2 border border-border-neutral rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cta"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as Tab)}
          >
            <option value="profile">Profile</option>
            <option value="orders">Orders ({orders.length})</option>
            <option value="wishlist">Wishlist ({wishlist.length})</option>
            <option value="settings">Settings</option>
          </select>
        </div>

        {/* Desktop tabs */}
        <div
          className="hidden md:flex items-stretch gap-0 border-b border-border-neutral"
          role="tablist"
          aria-label="Account sections"
        >
          {([
            { key: 'profile', label: 'Profile', icon: User },
            { key: 'orders', label: `Orders (${orders.length})`, icon: Receipt },
            { key: 'wishlist', label: `Wishlist (${wishlist.length})`, icon: Heart },
            { key: 'settings', label: 'Settings', icon: SettingsIcon },
          ] as Array<{ key: Tab; label: string; icon: React.ComponentType<{ size?: number }> }>).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`relative inline-flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === key
                  ? 'border-cta text-ink'
                  : 'border-transparent text-ink-secondary hover:text-ink'
              }`}
              onClick={() => setActiveTab(key)}
              role="tab"
              id={`tab-${key}`}
              aria-controls={`panel-${key}`}
              aria-selected={activeTab === key}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3">
          <Loader className="animate-spin" />
          <span>Loading your information...</span>
        </div>
      ) : (
        <>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div
              className="rounded-lg border border-border-neutral bg-white p-6 space-y-6"
              role="tabpanel"
              id="panel-profile"
              aria-labelledby="tab-profile"
            >
              <div>
                <h2 className="text-2xl font-serif font-bold text-ink mb-6">Profile Information</h2>
                
                {editingProfile ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-cta"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1">Phone</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                        className="w-full px-4 py-2 border border-border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-cta"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1">Address</label>
                      <input
                        type="text"
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        placeholder="123 Main St"
                        className="w-full px-4 py-2 border border-border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-cta"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1">City</label>
                        <input
                          type="text"
                          value={profileData.city}
                          onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                          className="w-full px-4 py-2 border border-border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-cta"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1">State</label>
                        <input
                          type="text"
                          value={profileData.state}
                          onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                          className="w-full px-4 py-2 border border-border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-cta"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1">Zip Code</label>
                      <input
                        type="text"
                        value={profileData.zipCode}
                        onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
                        className="w-full px-4 py-2 border border-border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-cta"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveProfile}
                        className="px-4 py-2 bg-cta text-white rounded-lg hover:bg-cta/90 transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingProfile(false)}
                        className="px-4 py-2 border border-border-neutral rounded-lg hover:bg-surface-2 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-border-neutral rounded-lg">
                        <p className="text-xs uppercase tracking-wider text-ink-secondary mb-1">Name</p>
                        <p className="font-medium text-ink">{session.user?.name || 'Not set'}</p>
                      </div>
                      <div className="p-4 border border-border-neutral rounded-lg">
                        <p className="text-xs uppercase tracking-wider text-ink-secondary mb-1">Email</p>
                        <p className="font-medium text-ink">{session.user?.email}</p>
                      </div>
                      <div className="p-4 border border-border-neutral rounded-lg">
                        <p className="text-xs uppercase tracking-wider text-ink-secondary mb-1">Phone</p>
                        <p className="font-medium text-ink">{profileData.phone || 'Not set'}</p>
                      </div>
                      <div className="p-4 border border-border-neutral rounded-lg">
                        <p className="text-xs uppercase tracking-wider text-ink-secondary mb-1">Account Type</p>
                        <p className="font-medium text-ink">
                          {((session.user as { role?: string } | undefined)?.role === 'admin') ? 'Administrator' : 'Customer'}
                        </p>
                      </div>
                      {profileData.address && (
                        <>
                          <div className="p-4 border border-border-neutral rounded-lg">
                            <p className="text-xs uppercase tracking-wider text-ink-secondary mb-1">Address</p>
                            <p className="font-medium text-ink">{profileData.address}</p>
                          </div>
                          <div className="p-4 border border-border-neutral rounded-lg">
                            <p className="text-xs uppercase tracking-wider text-ink-secondary mb-1">City, State</p>
                            <p className="font-medium text-ink">{profileData.city}, {profileData.state} {profileData.zipCode}</p>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setEditingProfile(true)}
                        className="px-4 py-2 bg-cta text-white rounded-lg hover:bg-cta/90 transition-colors"
                      >
                        Edit Profile
                      </button>
                      <button className="px-4 py-2 border border-border-neutral rounded-lg hover:bg-surface-2 transition-colors">
                        Change Password
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div
              className="rounded-lg border border-border-neutral bg-white p-6"
              role="tabpanel"
              id="panel-orders"
              aria-labelledby="tab-orders"
            >
              <h2 className="text-2xl font-serif font-bold text-ink mb-6">Order History</h2>
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border-neutral bg-surface-2 p-12 text-center">
                  <Receipt className="text-ink-secondary" size={48} />
                  <h3 className="font-serif text-lg font-bold text-ink">No Orders Yet</h3>
                  <p className="text-ink-secondary">You haven't placed any orders yet.</p>
                  <Link href="/shop" className="px-4 py-2 bg-cta text-white rounded-lg hover:bg-cta/90 transition-colors inline-block mt-2">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border-neutral space-y-4">
                  {orders.map((order) => {
                    const statusClass =
                      order.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : order.status === 'processing' || order.status === 'paid'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-800';
                    return (
                      <div key={order.id} className="py-4 border border-border-neutral rounded-lg p-4 hover:bg-surface-2 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <Link href={`/account/orders/${order.id}`} className="font-semibold text-link hover:underline text-lg">
                              Order #{order.orderNumber}
                            </Link>
                            <p className="text-sm text-ink-secondary mt-1">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>
                          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                            <div className="text-sm">
                              <p className="text-ink-secondary">Items</p>
                              <p className="font-semibold text-ink">{order.items?.length ?? 0}</p>
                            </div>
                            <div>
                              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusClass}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                            <div className="text-sm">
                              <p className="text-ink-secondary">Total</p>
                              <p className="font-semibold text-ink">{formatUSD(order.total)}</p>
                            </div>
                            <Link href={`/account/orders/${order.id}`} className="px-4 py-2 border border-border-neutral rounded-lg hover:bg-surface-2 transition-colors text-sm font-medium">
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div
              className="rounded-lg border border-border-neutral bg-white p-6"
              role="tabpanel"
              id="panel-wishlist"
              aria-labelledby="tab-wishlist"
            >
              <h2 className="text-2xl font-serif font-bold text-ink mb-6">My Wishlist</h2>
              {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border-neutral bg-surface-2 p-12 text-center">
                  <Heart className="text-ink-secondary" size={48} />
                  <h3 className="font-serif text-lg font-bold text-ink">No Wishlist Items</h3>
                  <p className="text-ink-secondary">Save items you love to your wishlist.</p>
                  <Link href="/shop" className="px-4 py-2 bg-cta text-white rounded-lg hover:bg-cta/90 transition-colors inline-block mt-2">
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((item) => (
                    <div key={item.id} className="group rounded-lg border border-border-neutral overflow-hidden hover:shadow-md transition-shadow">
                      <Link href={`/product/${item.product.slug}`} className="block overflow-hidden bg-surface-2 h-48">
                        {item.product.images[0] ? (
                          <Image
                            src={item.product.images[0].url}
                            alt={item.product.title}
                            width={400}
                            height={300}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-ink-secondary">No Image</div>
                        )}
                      </Link>
                      <div className="p-4 space-y-3">
                        <p className="text-xs uppercase tracking-wider text-ink-secondary">{item.product.category.name}</p>
                        <Link href={`/product/${item.product.slug}`} className="font-semibold text-ink hover:text-link line-clamp-2">
                          {item.product.title}
                        </Link>
                        <p className="text-lg font-semibold text-link">{formatUSD(item.product.price)}</p>
                        <div className="flex items-center gap-2 pt-2">
                          <button
                            onClick={() => removeFromWishlist(item.productId)}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border-neutral hover:bg-surface-2 transition-colors text-sm font-medium"
                            aria-label="Remove from wishlist"
                          >
                            <Heart size={16} />
                            Remove
                          </button>
                          <div className="flex-1">
                            <AddToCartButton
                              product={{
                                id: item.product.id,
                                title: item.product.title,
                                price: item.product.price,
                                slug: item.product.slug,
                                image: item.product.images[0]?.url || '/placeholder.jpg',
                                categoryName: item.product.category.name,
                              }}
                              quantity={1}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div
              className="rounded-lg border border-border-neutral bg-white p-6 max-w-2xl"
              role="tabpanel"
              id="panel-settings"
              aria-labelledby="tab-settings"
            >
              <h2 className="text-2xl font-serif font-bold text-ink mb-6">Settings</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 rounded-lg border border-border-neutral hover:bg-surface-2 transition-colors cursor-pointer">
                  <div>
                    <p className="font-medium text-ink">Email Notifications</p>
                    <p className="text-sm text-ink-secondary">Receive order updates and account alerts</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    aria-label="Toggle email notifications"
                    className="w-5 h-5 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-lg border border-border-neutral hover:bg-surface-2 transition-colors cursor-pointer">
                  <div>
                    <p className="font-medium text-ink">Newsletter Subscription</p>
                    <p className="text-sm text-ink-secondary">Occasional stories and new arrivals</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newsletterSubscribed}
                    onChange={(e) => setNewsletterSubscribed(e.target.checked)}
                    aria-label="Toggle newsletter subscription"
                    className="w-5 h-5 cursor-pointer"
                  />
                </label>

                <div className="pt-6 border-t border-border-neutral">
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                        alert('Account deletion request submitted.');
                      }
                    }}
                    className="text-sm font-medium text-red-600 hover:text-red-700 underline"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchData();
    }
  }, [status, router]);

  const fetchData = async () => {
    try {
      const [wishlistRes, ordersRes] = await Promise.all([
        fetch('/api/wishlist'),
        fetch('/api/orders'),
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
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        setWishlist(wishlist.filter((item) => item.productId !== productId));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  if (status === 'loading' || loading) {
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
      <div className="border-b border-[var(--color-gray-light)] bg-white">
        <div className="container py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-serif text-[42px] leading-tight text-brand-navy">My Account</h1>
              <p className="text-[14px] text-[var(--color-gray-dark)]">Welcome back, {session.user?.name}!</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="inline-flex items-center gap-2 rounded border border-[var(--color-gray-light)] px-3 py-2 text-[14px] text-[var(--color-gray-dark)] hover:bg-cream"
              aria-label="Sign out"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--color-gray-light)] bg-white">
        <div className="container">
          {/* Mobile select */}
          <div className="py-3 md:hidden">
            <label htmlFor="account-tab" className="sr-only">Choose section</label>
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
          {/* Desktop tabs */}
          <div
            className="hidden items-stretch gap-8 md:flex"
            role="tablist"
            aria-label="Account sections"
          >
            {([
              { key: 'profile', label: 'Profile', icon: User },
              { key: 'orders', label: `Orders (${orders.length})`, icon: Receipt },
              { key: 'wishlist', label: `Wishlist (${wishlist.length})`, icon: Heart },
              { key: 'settings', label: 'Settings', icon: SettingsIcon },
            ] as Array<{ key: Tab; label: string; icon: React.ComponentType<{ size?: number }> }>).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                className={`relative -mb-px inline-flex items-center gap-2 border-b-4 px-1 py-4 text-[14px] ${
                  activeTab === key
                    ? 'border-[var(--color-muted-gold)] text-[var(--color-charcoal)]'
                    : 'border-transparent text-[var(--color-gray-dark)] hover:text-[var(--color-charcoal)]'
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
        <div className="ki-container">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div
              className="rounded-lg border border-[var(--color-gray-light)] bg-white p-6"
              role="tabpanel"
              id="panel-profile"
              aria-labelledby="tab-profile"
            >
              <h2 className="mb-4 font-serif text-2xl">Profile Information</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between rounded border border-[var(--color-gray-light)] p-3">
                  <span className="text-[12px] uppercase tracking-wide text-[var(--color-gray-dark)]">Name</span>
                  <span className="font-medium">{session.user?.name || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between rounded border border-[var(--color-gray-light)] p-3">
                  <span className="text-[12px] uppercase tracking-wide text-[var(--color-gray-dark)]">Email</span>
                  <span className="font-medium">{session.user?.email}</span>
                </div>
                <div className="flex items-center justify-between rounded border border-[var(--color-gray-light)] p-3">
                  <span className="text-[12px] uppercase tracking-wide text-[var(--color-gray-dark)]">Phone</span>
                  <span className="font-medium">Not set</span>
                </div>
                <div className="flex items-center justify-between rounded border border-[var(--color-gray-light)] p-3">
                  <span className="text-[12px] uppercase tracking-wide text-[var(--color-gray-dark)]">Account Type</span>
                  <span className="font-medium">{((session.user as { role?: string } | undefined)?.role === 'admin') ? 'Administrator' : 'Customer'}</span>
                </div>
                <div className="flex items-center justify-between rounded border border-[var(--color-gray-light)] p-3">
                  <span className="text-[12px] uppercase tracking-wide text-[var(--color-gray-dark)]">Default Shipping</span>
                  <span className="font-medium">Not set</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button className="ki-btn-primary">Edit Profile</button>
                <button className="inline-flex items-center justify-center rounded border border-[var(--color-gray-light)] px-4 py-2 text-[14px] text-[var(--color-charcoal)] hover:bg-cream">Change Password</button>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div
              className="rounded-lg border border-[var(--color-gray-light)] bg-white p-6"
              role="tabpanel"
              id="panel-orders"
              aria-labelledby="tab-orders"
            >
              <h2 className="mb-4 font-serif text-2xl">Order History</h2>
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded border border-[var(--color-gray-light)] bg-cream p-8 text-center">
                  <Receipt className="text-[var(--color-gray-dark)]" size={48} />
                  <h3 className="font-serif text-xl">No Orders Yet</h3>
                  <p className="text-[var(--color-gray-dark)]">You haven't placed any orders yet.</p>
                  <Link href="/" className="ki-btn-primary">Start Shopping</Link>
                </div>
              ) : (
                <div className="divide-y divide-[var(--color-gray-light)]">
                  {orders.map((order) => {
                    const statusClass =
                      order.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : order.status === 'processing' || order.status === 'paid'
                        ? 'bg-[rgba(199,168,94,0.15)] text-[var(--color-charcoal)]'
                        : 'bg-gray-100 text-gray-800';
                    return (
                      <div key={order.id} className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-col">
                          <Link href={`/account/orders/${order.id}`} className="font-medium underline">Order #{order.orderNumber}</Link>
                          <span className="text-[12px] text-[var(--color-gray-dark)]">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center md:justify-end">
                          <span className="text-[14px] text-[var(--color-gray-dark)]">Items: {order.items?.length ?? 0}</span>
                          <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-[12px] ${statusClass}`}>{order.status}</span>
                          <span className="font-semibold">Total: {formatUSD(order.total)}</span>
                          <Link href={`/account/orders/${order.id}`} className="underline">View Details</Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div
              className="rounded-lg border border-[var(--color-gray-light)] bg-white p-6"
              role="tabpanel"
              id="panel-wishlist"
              aria-labelledby="tab-wishlist"
            >
              <h2 className="mb-4 font-serif text-2xl">My Wishlist</h2>
              {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded border border-[var(--color-gray-light)] bg-cream p-8 text-center">
                  <Heart className="text-[var(--color-gray-dark)]" size={48} />
                  <h3 className="font-serif text-xl">No Wishlist Items</h3>
                  <p className="text-[var(--color-gray-dark)]">Save items you love to your wishlist.</p>
                  <Link href="/" className="ki-btn-primary">Browse Products</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {wishlist.map((item) => (
                    <div key={item.id} className="group rounded-lg border border-[var(--color-gray-light)] bg-white p-3">
                      <Link href={`/product/${item.product.slug}`} className="block overflow-hidden rounded">
                        {item.product.images[0] ? (
                          <Image
                            src={item.product.images[0].url}
                            alt={item.product.title}
                            width={400}
                            height={400}
                            className="h-auto w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                          />
                        ) : (
                          <div className="flex h-[200px] items-center justify-center bg-cream text-[var(--color-gray-dark)]">No Image</div>
                        )}
                      </Link>
                      <div className="mt-3 flex flex-col gap-1">
                        <span className="text-[12px] uppercase tracking-wide text-[var(--color-gray-dark)]">{item.product.category.name}</span>
                        <Link href={`/product/${item.product.slug}`} className="font-medium hover:text-[var(--color-muted-gold)]">
                          {item.product.title}
                        </Link>
                        <span className="text-brand-gold font-semibold">{formatUSD(item.product.price)}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <button
                          onClick={() => removeFromWishlist(item.productId)}
                          className="inline-flex items-center gap-2 rounded border border-[var(--color-gray-light)] px-3 py-2 text-[14px] hover:bg-cream"
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
                            image: item.product.images[0]?.url || '/placeholder.jpg',
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
          {activeTab === 'settings' && (
            <div
              className="rounded-lg border border-[var(--color-gray-light)] bg-white p-6"
              role="tabpanel"
              id="panel-settings"
              aria-labelledby="tab-settings"
            >
              <h2 className="mb-4 font-serif text-2xl">Settings</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between rounded border border-[var(--color-gray-light)] p-3">
                  <div>
                    <span className="block font-medium">Email Notifications</span>
                    <span className="text-[13px] text-[var(--color-gray-dark)]">Order updates and account alerts</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    aria-label="Toggle email notifications"
                    className="h-5 w-5"
                  />
                </label>

                <label className="flex items-center justify-between rounded border border-[var(--color-gray-light)] p-3">
                  <div>
                    <span className="block font-medium">Newsletter Subscription</span>
                    <span className="text-[13px] text-[var(--color-gray-dark)]">Occasional stories and arrivals</span>
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
                      if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                        alert('Account deletion request submitted.');
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
    </div>
  );
}
