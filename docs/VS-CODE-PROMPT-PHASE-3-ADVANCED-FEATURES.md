# VS CODE AI AGENT PROMPT – KOLLECT-IT PHASE 3 ADVANCED FEATURES

## MISSION

Implement advanced features: Email integration, Wishlist functionality, Advanced search, and Performance optimization.

---

## PART 1: EMAIL INTEGRATION (Resend)

### Step 1: Create Email Templates

Create `src/emails/` directory with these files:

### File: src/emails/welcome.tsx

```typescript
import { Html, Body, Container, Text, Heading, Link, Button } from '@react-email/components';

interface WelcomeEmailProps {
  userFirstName: string;
}

export default function WelcomeEmail({ userFirstName }: WelcomeEmailProps) {
  return (
    <Html>
      <Body>
        <Container>
          <Heading>Welcome to Kollect-It!</Heading>
          <Text>Hi {userFirstName},</Text>
          <Text>
            Thank you for joining Kollect-It, your premier marketplace for fine art and collectibles.
          </Text>
          <Button href="https://kollect-it.com/shop">
            Start Browsing
          </Button>
          <Text>Happy collecting!</Text>
        </Container>
      </Body>
    </Html>
  );
}
```

### File: src/emails/order-confirmation.tsx**

```typescript
import { Html, Body, Container, Text, Heading, Button } from '@react-email/components';

interface OrderConfirmationProps {
  orderNumber: string;
  totalAmount: number;
  itemCount: number;
}

export default function OrderConfirmationEmail({
  orderNumber,
  totalAmount,
  itemCount,
}: OrderConfirmationProps) {
  return (
    <Html>
      <Body>
        <Container>
          <Heading>Order Confirmed!</Heading>
          <Text>Order #{orderNumber}</Text>
          <Text>Items: {itemCount}</Text>
          <Text>Total: ${totalAmount.toFixed(2)}</Text>
          <Button href="https://kollect-it.com/account/orders">
            View Order
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
```

### File: src/emails/shipment-notification.tsx**

```typescript
import { Html, Body, Container, Text, Heading, Button, Link } from '@react-email/components';

interface ShipmentNotificationProps {
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
}

export default function ShipmentNotificationEmail({
  trackingNumber,
  carrier,
  estimatedDelivery,
}: ShipmentNotificationProps) {
  return (
    <Html>
      <Body>
        <Container>
          <Heading>Your Order is On Its Way!</Heading>
          <Text>Tracking Number: {trackingNumber}</Text>
          <Text>Carrier: {carrier}</Text>
          <Text>Estimated Delivery: {estimatedDelivery}</Text>
          <Button href={`https://tracking.${carrier.toLowerCase()}.com/${trackingNumber}`}>
            Track Package
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
```

### Step 2: Create Email Service

### File: src/lib/email-service.ts**

```typescript
import { Resend } from 'resend';
import WelcomeEmail from '@/emails/welcome';
import OrderConfirmationEmail from '@/emails/order-confirmation';
import ShipmentNotificationEmail from '@/emails/shipment-notification';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, firstName: string) {
  try {
    const result = await resend.emails.send({
      from: 'Kollect-It <noreply@kollect-it.com>',
      to: email,
      subject: 'Welcome to Kollect-It',
      react: WelcomeEmail({ userFirstName: firstName }),
    });
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error };
  }
}

export async function sendOrderConfirmationEmail(
  email: string,
  orderNumber: string,
  totalAmount: number,
  itemCount: number
) {
  try {
    const result = await resend.emails.send({
      from: 'Kollect-It <orders@kollect-it.com>',
      to: email,
      subject: `Order Confirmation #${orderNumber}`,
      react: OrderConfirmationEmail({ orderNumber, totalAmount, itemCount }),
    });
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    return { success: false, error };
  }
}

export async function sendShipmentNotificationEmail(
  email: string,
  trackingNumber: string,
  carrier: string,
  estimatedDelivery: string
) {
  try {
    const result = await resend.emails.send({
      from: 'Kollect-It <shipping@kollect-it.com>',
      to: email,
      subject: 'Your Order is On Its Way',
      react: ShipmentNotificationEmail({
        trackingNumber,
        carrier,
        estimatedDelivery,
      }),
    });
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Failed to send shipment notification email:', error);
    return { success: false, error };
  }
}
```

### Step 3: Call Email Service on Events

Update `src/app/api/auth/callback/route.ts` to send welcome email on signup:

```typescript
// After user signup, call:
await sendWelcomeEmail(user.email, user.firstName);
```

---

## PART 2: WISHLIST FUNCTIONALITY

### Step 1: Create Wishlist Database Schema

Add to `prisma/schema.prisma`:

```prisma
model Wishlist {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, productId])
  @@index([userId])
}

// Add to User model:
wishlistItems Wishlist[]

// Add to Product model:
wishlistItems Wishlist[]
```

### Step 2: Create Wishlist API Routes

### File: src/app/api/wishlist/add/route.ts**

```typescript
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await req.json();

    const wishlistItem = await prisma.wishlist.upsert({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        productId,
      },
    });

    return NextResponse.json({ success: true, wishlistItem });
  } catch (error) {
    console.error('Failed to add to wishlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### File: src/app/api/wishlist/remove/route.ts**

```typescript
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await req.json();

    await prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to remove from wishlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### File: src/app/api/wishlist/list/route.ts**

```typescript
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ wishlistItems });
  } catch (error) {
    console.error('Failed to fetch wishlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Step 3: Create Wishlist UI Component

### File: src/components/WishlistButton.tsx**

```typescript
'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface WishlistButtonProps {
  productId: string;
  isWishlisted?: boolean;
}

export function WishlistButton({ productId, isWishlisted = false }: WishlistButtonProps) {
  const [isAdded, setIsAdded] = useState(isWishlisted);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function handleToggleWishlist() {
    setIsLoading(true);
    try {
      const response = await fetch(
        isAdded ? '/api/wishlist/remove' : '/api/wishlist/add',
        {
          method: isAdded ? 'DELETE' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        }
      );

      if (!response.ok) throw new Error('Failed');

      setIsAdded(!isAdded);
      toast({
        title: isAdded ? 'Removed from wishlist' : 'Added to wishlist',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update wishlist',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className={isAdded ? 'text-red-500' : ''}
    >
      <Heart
        className="w-5 h-5"
        fill={isAdded ? 'currentColor' : 'none'}
      />
    </Button>
  );
}
```

---

## PART 3: ADVANCED SEARCH

### Step 1: Create Search API Route

### File: src/app/api/search/route.ts**

```typescript
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'recent';

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const where: any = {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    };

    if (category) {
      where.category = category;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    const orderBy: any = {};
    switch (sortBy) {
      case 'price-low':
        orderBy.price = 'asc';
        break;
      case 'price-high':
        orderBy.price = 'desc';
        break;
      case 'popular':
        orderBy.salesCount = 'desc';
        break;
      default:
        orderBy.createdAt = 'desc';
    }

    const results = await prisma.product.findMany({
      where,
      orderBy,
      take: 20,
      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
        image: true,
        category: true,
      },
    });

    return NextResponse.json({ results, count: results.length });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Step 2: Create Search Component

### File: src/components/AdvancedSearch.tsx**

```typescript
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import debounce from 'lodash/debounce';

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  price: number;
  image: string;
  category: string;
}

export function AdvancedSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const performSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const params = new URLSearchParams({
          q: searchQuery,
          ...(minPrice && { minPrice }),
          ...(maxPrice && { maxPrice }),
        });

        const response = await fetch(`/api/search?${params}`);
        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    [minPrice, maxPrice]
  );

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    performSearch(value);
  };

  const handleSearch = () => {
    const params = new URLSearchParams({ q: query });
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    router.push(`/search?${params}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={handleQueryChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={isSearching}>
          <Search className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((result) => (
            <div
              key={result.id}
              className="p-4 border rounded-lg hover:shadow-lg cursor-pointer"
              onClick={() => router.push(`/product/${result.slug}`)}
            >
              <img
                src={result.image}
                alt={result.title}
                className="w-full h-32 object-cover rounded mb-2"
              />
              <h3 className="font-semibold truncate">{result.title}</h3>
              <p className="text-sm text-gray-500">{result.category}</p>
              <p className="font-bold text-lg">${result.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## PART 4: PERFORMANCE OPTIMIZATION

### Step 1: Image Optimization

Update all `<img>` tags to use Next.js `Image` component:

```typescript
import Image from 'next/image';

// Replace:
// <img src="/path/to/image.jpg" alt="..." />

// With:
<Image
  src="/path/to/image.jpg"
  alt="..."
  width={400}
  height={300}
  priority={false}
  placeholder="blur"
/>
```

### Step 2: Code Splitting

Add dynamic imports in `src/components/`:

```typescript
import dynamic from 'next/dynamic';

// Heavy components
const AdminPanel = dynamic(() => import('@/components/AdminPanel'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

const Wishlist = dynamic(() => import('@/components/Wishlist'), {
  loading: () => <p>Loading...</p>,
});
```

### Step 3: Caching Strategy

Update `next.config.js`:

```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  images: {
    remotePatterns: [
      { hostname: 'ik.imagekit.io' },
    ],
    unoptimized: false,
  },
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
});
```

### Step 4: Database Query Optimization

Add indexes to `prisma/schema.prisma`:

```prisma
model Product {
  // ... existing fields
  @@index([category])
  @@index([createdAt])
  @@fulltext([title, description])
}
```

---

## PART 5: VERIFY & TEST

Run tests:

```bash
# Build with bundle analysis
ANALYZE=true bun run build

# Check for performance issues
bun run lint
bun run build

# Start dev server
bun run dev

# Test email sending (if configured)
# curl -X POST http://localhost:3000/api/test-email
```

---

## PART 6: BROWSER TESTING

Test in `http://localhost:3000`:

- [ ] Advanced search works with filters
- [ ] Wishlist add/remove functions
- [ ] Images load with optimization
- [ ] Search results appear quickly
- [ ] Dynamic imports load without lag
- [ ] Email templates render correctly
- [ ] No console errors
- [ ] Performance metrics improved

---

## PART 7: COMMIT

```bash
git add .
git commit -m "feat: Phase 3 - Email integration, Wishlist, Advanced search, Performance optimization"
git push origin main
```

---

## SUCCESS CRITERIA

- ✅ Email service sends all templates
- ✅ Wishlist add/remove/list APIs work
- ✅ Advanced search filters by price, category
- ✅ Images optimized with Next.js Image
- ✅ Code splitting reduces bundle size
- ✅ Database queries indexed and fast
- ✅ All tests pass
- ✅ Build succeeds with no warnings

---

## ⏱️ ESTIMATED TIME

**3-4 hours** for complete Phase 3 execution

---

## 🚀 HOW TO USE THIS PROMPT

1. Copy everything from "# VS CODE AI AGENT PROMPT" to the end
2. Open VS Code to your project
3. Press Ctrl + I to open AI Agent
4. Paste the prompt
5. Press Enter and follow the AI's guidance

---

## 📋 NEXT STEPS

After completing Phase 3:

1. Run `bun run dev` to start dev server
2. Test all features end-to-end
3. Verify performance metrics
4. Consider Phase 4: Analytics, Admin Panel, Advanced Features

