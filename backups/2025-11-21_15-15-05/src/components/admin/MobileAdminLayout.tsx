/**
 * Mobile Admin Layout Component
 * Phase 6 Step 9 - Mobile-optimized admin interface
 */

"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  X,
  Home,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Mail,
  TrendingUp,
  Store,
  ChevronRight,
  Bell,
} from "lucide-react";

interface MobileAdminLayoutProps {
  children: React.ReactNode;
}

export function MobileAdminLayout({ children }: MobileAdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Customers", href: "/admin/customers", icon: Users },
    {
      name: "Analytics",
      icon: BarChart3,
      children: [
        { name: "Sales", href: "/admin/analytics/sales" },
        { name: "Products", href: "/admin/analytics/products" },
        { name: "Traffic", href: "/admin/analytics/traffic" },
      ],
    },
    { name: "Sellers", href: "/admin/sellers", icon: Store },
    { name: "Reports", href: "/admin/reports", icon: TrendingUp },
    { name: "Emails", href: "/admin/emails", icon: Mail },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          <h1 className="text-lg font-bold text-gray-900">Kollect-It Admin</h1>
          <button
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Notifications"
          >
            <Bell className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-white transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="mt-16 px-4 py-4 space-y-1 overflow-y-auto h-full">
          {navigation.map((item) => (
            <div key={item.name}>
              {item.href ? (
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  {item.name}
                </Link>
              ) : (
                <>
                  <div className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700">
                    {item.icon && <item.icon className="w-5 h-5" />}
                    {item.name}
                  </div>
                  {item.children && (
                    <div className="ml-8 space-y-1 mt-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                            isActive(child.href)
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <ChevronRight className="w-4 h-4" />
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <h1 className="text-xl font-bold text-gray-900">
              Kollect-It Admin
            </h1>
          </div>
          <nav className="mt-5 flex-1 px-4 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon && <item.icon className="w-5 h-5" />}
                    {item.name}
                  </Link>
                ) : (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700">
                      {item.icon && <item.icon className="w-5 h-5" />}
                      {item.name}
                    </div>
                    {item.children && (
                      <div className="ml-8 space-y-1 mt-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                              isActive(child.href)
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            <ChevronRight className="w-4 h-4" />
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="pt-16 lg:pt-0">{children}</main>
      </div>
    </div>
  );
}

