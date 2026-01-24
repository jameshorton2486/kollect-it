/**
 * Database Optimization Utilities
 * Phase 6 Step 10 - Performance optimization with indexes and query optimization
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Recommended database indexes for optimal performance
 * Run these in your database migration
 */
export const RECOMMENDED_INDEXES = `
-- Product indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON "Product"("category");
CREATE INDEX IF NOT EXISTS idx_products_status ON "Product"("status");
CREATE INDEX IF NOT EXISTS idx_products_created_at ON "Product"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_products_price ON "Product"("price");
CREATE INDEX IF NOT EXISTS idx_products_featured ON "Product"("featured") WHERE "featured" = true;

-- Order indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON "Order"("userId");
CREATE INDEX IF NOT EXISTS idx_orders_status ON "Order"("status");
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON "Order"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_orders_total ON "Order"("total");
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON "Order"("paymentStatus");

-- OrderItem indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON "OrderItem"("orderId");
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON "OrderItem"("productId");

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON "User"("email");
CREATE INDEX IF NOT EXISTS idx_users_role ON "User"("role");
CREATE INDEX IF NOT EXISTS idx_users_created_at ON "User"("createdAt" DESC);

-- Session indexes (if using database sessions)
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON "Session"("userId");
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON "Session"("expires");

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON "Order"("userId", "status");
CREATE INDEX IF NOT EXISTS idx_products_category_status ON "Product"("category", "status");
`;

/**
 * Optimized query helpers with proper select fields
 */
export const optimizedQueries = {
  /**
   * Get paginated products with minimal fields for list views
   */
  getProductsList: async (
    page: number = 1,
    limit: number = 20,
    filters?: {
      category?: string;
      status?: string;
      minPrice?: number;
      maxPrice?: number;
    },
  ) => {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters?.category) where.category = filters.category;
    if (filters?.status) where.status = filters.status;
    if (filters?.minPrice || filters?.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = filters.minPrice;
      if (filters.maxPrice) where.price.lte = filters.maxPrice;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select: {
          id: true,
          title: true,
          price: true,
          Category: true,
          status: true,
          Image: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1,
      },
    };
  },

  /**
   * Get paginated orders with user info
   */
  getOrdersList: async (
    page: number = 1,
    limit: number = 20,
    filters?: {
      status?: string;
      userId?: string;
      dateFrom?: Date;
      dateTo?: Date;
    },
  ) => {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.userId) where.userId = filters.userId;
    if (filters?.dateFrom || filters?.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
      if (filters.dateTo) where.createdAt.lte = filters.dateTo;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          total: true,
          paymentStatus: true,
          createdAt: true,
          User: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: { OrderItem: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1,
      },
    };
  },

  /**
   * Get analytics data with aggregations
   */
  getAnalytics: async (dateFrom: Date, dateTo: Date) => {
    const [orderStats, revenueByDay, topProducts, productsByCategory] =
      await Promise.all([
        // Order statistics
        prisma.order.aggregate({
          where: {
            createdAt: { gte: dateFrom, lte: dateTo },
            status: { not: "cancelled" },
          },
          _count: true,
          _sum: { total: true },
          _avg: { total: true },
        }),

        // Revenue by day
        prisma.$queryRaw`
        SELECT
          DATE("createdAt") as date,
          COUNT(*) as order_count,
          SUM(total) as revenue
        FROM "Order"
        WHERE "createdAt" >= ${dateFrom}
          AND "createdAt" <= ${dateTo}
          AND status != 'cancelled'
        GROUP BY DATE("createdAt")
        ORDER BY date DESC
      `,

        // Top selling products
        prisma.orderItem.groupBy({
          by: ["productId"],
          where: {
            Order: {
              createdAt: { gte: dateFrom, lte: dateTo },
              status: { not: "cancelled" },
            },
          },
          _sum: { quantity: true },
          _count: true,
          orderBy: { _sum: { quantity: "desc" } },
          take: 10,
        }),

        // Products by category count
        prisma.product.groupBy({
          by: ["categoryId"],
          _count: true,
        }),
      ]);

    return {
      orderStats,
      revenueByDay,
      topProducts,
      productsByCategory,
    };
  },
};

/**
 * Database maintenance utilities
 */
export const maintenance = {
  /**
   * Clean up expired sessions (if Session model exists)
   */
  cleanExpiredSessions: async () => {
    // Note: Uncomment if you have a Session model in your Prisma schema
    /*
    const result = await prisma.session.deleteMany({
      where: {
        expires: {
          lt: new Date(),
        },
      },
    });
    return result.count;
    */
    return 0; // Placeholder
  },

  /**
   * Archive old orders (move to archive table or mark as archived)
   */
  archiveOldOrders: async (daysOld: number = 365) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await prisma.order.updateMany({
      where: {
        createdAt: { lt: cutoffDate },
        status: { in: ["delivered", "cancelled"] },
      },
      data: {
        // Add an 'archived' field to your schema if needed
        // archived: true,
      },
    });
    return result.count;
  },

  /**
   * Get database statistics
   */
  getStats: async () => {
    const [productCount, orderCount, userCount, recentOrders] =
      await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.user.count(),
        prisma.order.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
        }),
      ]);

    return {
      products: productCount,
      orders: orderCount,
      users: userCount,
      recentOrders,
    };
  },
};
