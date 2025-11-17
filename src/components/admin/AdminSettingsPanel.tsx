"use client";

/**
 * Admin Settings Panel Component
 * Phase 6 Step 8 - Unified admin settings and configuration
 */

import { useState } from "react";
import {
  Store,
  CreditCard,
  Truck,
  Calculator,
  Tag,
  Save,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";

interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  timezone: string;
  language: string;
}

interface PaymentSettings {
  stripeEnabled: boolean;
  stripePublishableKey: string;
  stripeSecretKey: string;
  paypalEnabled: boolean;
  paypalClientId: string;
  testMode: boolean;
}

interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  flatRate: number;
  freeShippingThreshold: number;
}

interface TaxRate {
  id: string;
  region: string;
  rate: number;
  applyToShipping: boolean;
}

interface CategoryConfig {
  id: string;
  name: string;
  slug: string;
  description: string;
  active: boolean;
}

export function AdminSettingsPanel() {
  const [activeTab, setActiveTab] = useState("store");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  // Store Settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    storeName: "Kollect-It Marketplace",
    storeEmail: "admin@kollect-it.com",
    storePhone: "+1 (555) 123-4567",
    storeAddress: "123 Main St, City, State 12345",
    currency: "USD",
    timezone: "America/New_York",
    language: "en",
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    stripeEnabled: true,
    stripePublishableKey: "pk_test_...",
    stripeSecretKey: "••••••••",
    paypalEnabled: false,
    paypalClientId: "",
    testMode: true,
  });

  // Shipping Zones
  const [shippingZones] = useState<ShippingZone[]>([
    {
      id: "1",
      name: "Domestic",
      countries: ["US"],
      flatRate: 9.99,
      freeShippingThreshold: 100,
    },
    {
      id: "2",
      name: "International",
      countries: ["CA", "UK"],
      flatRate: 24.99,
      freeShippingThreshold: 200,
    },
  ]);

  // Tax Rates
  const [taxRates] = useState<TaxRate[]>([
    { id: "1", region: "California", rate: 7.25, applyToShipping: false },
    { id: "2", region: "New York", rate: 8.875, applyToShipping: true },
  ]);

  // Categories
  const [categories] = useState<CategoryConfig[]>([
    {
      id: "1",
      name: "Antiques",
      slug: "antiques",
      description: "Vintage and antique items",
      active: true,
    },
    {
      id: "2",
      name: "Collectibles",
      slug: "collectibles",
      description: "Rare collectible items",
      active: true,
    },
    {
      id: "3",
      name: "Art",
      slug: "art",
      description: "Fine art and prints",
      active: true,
    },
  ]);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tab: activeTab,
          data:
            activeTab === "store"
              ? storeSettings
              : activeTab === "payment"
                ? paymentSettings
                : activeTab === "shipping"
                  ? shippingZones
                  : activeTab === "tax"
                    ? taxRates
                    : categories,
        }),
      });

      if (response.ok) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "store", label: "Store Settings", icon: Store },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "tax", label: "Tax Rates", icon: Calculator },
    { id: "categories", label: "Categories", icon: Tag },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admin Settings</h2>
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Save Status Alert */}
      {saveStatus === "success" && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          <CheckCircle className="w-5 h-5" />
          <span>Settings saved successfully!</span>
        </div>
      )}
      {saveStatus === "error" && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <AlertCircle className="w-5 h-5" />
          <span>Error saving settings. Please try again.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Store Settings Tab */}
      {activeTab === "store" && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Store Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="store-name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Store Name
                </label>
                <input
                  id="store-name"
                  type="text"
                  value={storeSettings.storeName}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      storeName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="store-email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Store Email
                </label>
                <input
                  id="store-email"
                  type="email"
                  value={storeSettings.storeEmail}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      storeEmail: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="store-phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number
                </label>
                <input
                  id="store-phone"
                  type="tel"
                  value={storeSettings.storePhone}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      storePhone: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="store-address"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Address
                </label>
                <input
                  id="store-address"
                  type="text"
                  value={storeSettings.storeAddress}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      storeAddress: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Regional Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="currency"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Currency
                </label>
                <select
                  id="currency"
                  value={storeSettings.currency}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      currency: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="timezone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Timezone
                </label>
                <select
                  id="timezone"
                  value={storeSettings.timezone}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      timezone: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="language"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Language
                </label>
                <select
                  id="language"
                  value={storeSettings.language}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      language: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Settings Tab */}
      {activeTab === "payment" && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Stripe Configuration</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="stripe-enabled"
                  type="checkbox"
                  checked={paymentSettings.stripeEnabled}
                  onChange={(e) =>
                    setPaymentSettings({
                      ...paymentSettings,
                      stripeEnabled: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="stripe-enabled"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  Enable Stripe Payments
                </label>
              </div>
              <div>
                <label
                  htmlFor="stripe-publishable"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Publishable Key
                </label>
                <input
                  id="stripe-publishable"
                  type="text"
                  value={paymentSettings.stripePublishableKey}
                  onChange={(e) =>
                    setPaymentSettings({
                      ...paymentSettings,
                      stripePublishableKey: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="pk_live_..."
                />
              </div>
              <div>
                <label
                  htmlFor="stripe-secret"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Secret Key
                </label>
                <input
                  id="stripe-secret"
                  type="password"
                  value={paymentSettings.stripeSecretKey}
                  onChange={(e) =>
                    setPaymentSettings({
                      ...paymentSettings,
                      stripeSecretKey: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="sk_live_..."
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">PayPal Configuration</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="paypal-enabled"
                  type="checkbox"
                  checked={paymentSettings.paypalEnabled}
                  onChange={(e) =>
                    setPaymentSettings({
                      ...paymentSettings,
                      paypalEnabled: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="paypal-enabled"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  Enable PayPal Payments
                </label>
              </div>
              <div>
                <label
                  htmlFor="paypal-client"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Client ID
                </label>
                <input
                  id="paypal-client"
                  type="text"
                  value={paymentSettings.paypalClientId}
                  onChange={(e) =>
                    setPaymentSettings({
                      ...paymentSettings,
                      paypalClientId: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="AYxxxxxxxxxxxxxxxxxxxxxxxx"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <input
              id="test-mode"
              type="checkbox"
              checked={paymentSettings.testMode}
              onChange={(e) =>
                setPaymentSettings({
                  ...paymentSettings,
                  testMode: e.target.checked,
                })
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="test-mode"
              className="ml-2 text-sm font-medium text-yellow-800"
            >
              Test Mode (Use test API keys only)
            </label>
          </div>
        </div>
      )}

      {/* Shipping Zones Tab */}
      {activeTab === "shipping" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Shipping Zones</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Add Zone
            </button>
          </div>
          <div className="space-y-4">
            {shippingZones.map((zone) => (
              <div
                key={zone.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{zone.name}</h4>
                    <p className="text-sm text-gray-500">
                      Countries: {zone.countries.join(", ")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600">
                      Flat Rate
                    </label>
                    <p className="font-medium">${zone.flatRate}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">
                      Free Shipping Over
                    </label>
                    <p className="font-medium">${zone.freeShippingThreshold}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tax Rates Tab */}
      {activeTab === "tax" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Tax Rates</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Add Tax Rate
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Region
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tax Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Apply to Shipping
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {taxRates.map((rate) => (
                  <tr key={rate.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {rate.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {rate.rate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {rate.applyToShipping ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Product Categories</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {category.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          category.active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {category.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

