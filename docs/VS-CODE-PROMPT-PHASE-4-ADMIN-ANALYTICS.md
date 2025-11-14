# VS CODE AI AGENT PROMPT – KOLLECT-IT PHASE 4 ANALYTICS & ADMIN PANEL

## MISSION

Build a comprehensive admin dashboard with analytics, user management, product management, and order tracking.

---

## PART 1: ANALYTICS SETUP

### Step 1: Create Analytics Service

**File: src/lib/analytics.ts**

```typescript
import { prisma } from "@/lib/prisma";

export async function getAnalyticsData() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  // Total revenue
  const totalRevenue = await prisma.order.aggregate({
    where: { status: "completed", createdAt: { gte: thirtyDaysAgo } },
    _sum: { total: true },
  });

  // Total orders
  const totalOrders = await prisma.order.count({
    where: { createdAt: { gte: thirtyDaysAgo } },
  });

  // Average order value
  const avgOrderValue = totalRevenue._sum.total || 0 / (totalOrders || 1);

  // Total customers
  const totalCustomers = await prisma.user.count({
    where: { createdAt: { gte: thirtyDaysAgo } },
  });

  // Top products
  const topProducts = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: { order: { createdAt: { gte: thirtyDaysAgo } } },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 5,
  });

  // Revenue by category
  const revenueByCategory = await prisma.orderItem.groupBy({
    by: ["product", "category"],
    where: { order: { createdAt: { gte: thirtyDaysAgo } } },
    _sum: { price: true },
  });

  // Order trends
  const orderTrends = await prisma.order.groupBy({
    by: ["createdAt"],
    where: { createdAt: { gte: ninetyDaysAgo } },
    _count: { id: true },
    _sum: { total: true },
  });

  return {
    totalRevenue: totalRevenue._sum.total || 0,
    totalOrders,
    avgOrderValue,
    totalCustomers,
    topProducts,
    revenueByCategory,
    orderTrends,
  };
}

export async function getUserMetrics() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return users;
}

export async function getProductMetrics() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      category: true,
      salesCount: true,
      createdAt: true,
      _count: { select: { wishlistItems: true } },
    },
    orderBy: { salesCount: "desc" },
    take: 50,
  });

  return products;
}
```

### Step 2: Create Analytics API Route

**File: src/app/api/admin/analytics/route.ts**

```typescript
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import {
  getAnalyticsData,
  getUserMetrics,
  getProductMetrics,
} from "@/lib/analytics";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [analytics, users, products] = await Promise.all([
      getAnalyticsData(),
      getUserMetrics(),
      getProductMetrics(),
    ]);

    return NextResponse.json({
      analytics,
      users,
      products,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
```

---

## PART 2: ADMIN DASHBOARD COMPONENTS

### Step 3: Create Dashboard Layout

**File: src/app/admin/dashboard/page.tsx**

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  totalCustomers: number;
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      const response = await fetch('/api/admin/analytics');
      const data = await response.json();
      setAnalytics(data.analytics);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics?.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">New customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics?.avgOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Average order</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

## PART 3: USER MANAGEMENT

### Step 4: Create Users Management Page

**File: src/app/admin/users/page.tsx**

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  _count: { orders: number };
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await fetch('/api/admin/analytics');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleBlockUser(userId: string) {
    try {
      await fetch(`/api/admin/users/${userId}/block`, { method: 'POST' });
      fetchUsers();
    } catch (error) {
      console.error('Failed to block user:', error);
    }
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold">User Management</h1>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user._count.orders}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBlockUser(user.id)}
                    >
                      Block
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
```

---

## PART 4: PRODUCT MANAGEMENT

### Step 5: Create Products Management Page

**File: src/app/admin/products/page.tsx**

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  salesCount: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const response = await fetch('/api/admin/analytics');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddProduct(formData: FormData) {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        setIsAddingProduct(false);
        fetchProducts();
      }
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  }

  return (
    <div className="p-8 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleAddProduct(formData);
            }}>
              <div className="space-y-4">
                <Input name="title" placeholder="Product Title" required />
                <Input name="price" type="number" placeholder="Price" required />
                <Input name="category" placeholder="Category" required />
                <Textarea name="description" placeholder="Description" />
                <Button type="submit">Create Product</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.salesCount}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
```

---

## PART 5: ORDER MANAGEMENT

### Step 6: Create Orders Management Page

**File: src/app/admin/orders/page.tsx**

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customer: { email: string };
  createdAt: Date;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold">Order Management</h1>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{order.customer?.email}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status]}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
```

---

## PART 6: ADMIN LAYOUT

### Step 7: Create Admin Layout Component

**File: src/app/admin/layout.tsx**

```typescript
'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { BarChart3, Users, Package, ShoppingCart, Settings } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/login');
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: BarChart3 },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-ink text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-ink-light transition"
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        {children}
      </div>
    </div>
  );
}
```

---

## PART 7: ADMIN API ROUTES

### Step 8: Create Admin API Routes

**File: src/app/api/admin/orders/route.ts**

```typescript
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      include: { customer: { select: { email: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Orders error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
```

**File: src/app/api/admin/products/route.ts**

```typescript
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;

    const product = await prisma.product.create({
      data: {
        title,
        price,
        category,
        description,
        slug: title.toLowerCase().replace(/\s+/g, "-"),
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
```

---

## PART 8: VERIFY & TEST

Run tests:

```bash
bun run lint
bun run build
bun run dev
```

---

## PART 9: BROWSER TESTING

Test in `http://localhost:3000/admin`:

- [ ] Dashboard loads with KPI cards
- [ ] Charts display correctly
- [ ] User list shows all users
- [ ] Product management works
- [ ] Order management displays orders
- [ ] Can add new products
- [ ] Status badges display correctly
- [ ] All navigation links work
- [ ] Admin-only access is protected

---

## PART 10: COMMIT

```bash
git add .
git commit -m "feat: Phase 4 - Complete admin dashboard with analytics, user/product/order management"
git push origin main
```

---

## SUCCESS CRITERIA

- ✅ Dashboard displays key metrics (revenue, orders, customers)
- ✅ Analytics data aggregates correctly
- ✅ Charts render with real data
- ✅ User management functional
- ✅ Product management functional
- ✅ Order management with status tracking
- ✅ Admin layout with sidebar navigation
- ✅ All pages protected (admin-only)
- ✅ All tests pass
- ✅ Build succeeds

---

## ⏱️ ESTIMATED TIME

**3-4 hours** for complete Phase 4 execution

---

## 🚀 HOW TO USE THIS PROMPT

1. Copy everything from "# VS CODE AI AGENT PROMPT" to the end
2. Open VS Code to your project
3. Press Ctrl + I to open AI Agent
4. Paste the prompt
5. Press Enter and follow the AI's guidance

---

## 📋 NEXT STEPS

After completing Phase 4:

1. Run `bun run dev` to start dev server
2. Test all admin features
3. Consider Phase 5: Production Hardening & Deployment
