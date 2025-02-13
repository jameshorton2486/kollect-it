import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../ProductCard';
import { useCart } from '@/contexts/CartContext';
import { vi, describe, it, expect } from 'vitest';

// Mock the CartContext
vi.mock('@/contexts/CartContext', () => ({
  useCart: vi.fn(() => ({
    addItem: vi.fn(),
  })),
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

const mockProduct = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 100,
  image_url: 'test.jpg',
  condition: 'excellent',
  era: 'vintage',
  estimated_age: '50 years',
  category_id: '123',
  created_at: new Date().toISOString(),
  user_id: 'test-user',
  stock_quantity: 1,
  low_stock_threshold: 5,
  provenance: 'Test provenance',
  search_vector: {},
  seo_description: 'Test SEO description',
  seo_title: 'Test Product',
  seo_keywords: ['test'],
  shipping_info: { weight: 1 },
  status: 'active',
  stock_status: 'in_stock',
  social_shares: 0,
  subcategory_id: 'test-sub',
  tags: ['test'],
  updated_at: new Date().toISOString(),
} as const;

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(
      <ProductCard 
        product={mockProduct}
        categoryName="Test Category"
        badges={{ isNew: true, isTrending: true }}
      />
    );

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByText(/\$100/)).toBeInTheDocument();
  });

  it('handles add to cart action', async () => {
    const mockAddItem = vi.fn();
    (useCart as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => ({
      addItem: mockAddItem,
    }));

    render(
      <ProductCard 
        product={mockProduct}
        categoryName="Test Category"
        badges={{ isNew: false, isTrending: false }}
      />
    );

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButton);

    expect(mockAddItem).toHaveBeenCalledWith(mockProduct);
  });

  it('displays "Out of Stock" when stock quantity is zero', () => {
    const outOfStockProduct = { ...mockProduct, stock_quantity: 0 };
    render(
      <ProductCard 
        product={outOfStockProduct}
        categoryName="Test Category"
        badges={{ isNew: false, isTrending: false }}
      />
    );

    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
  });

  it('applies badges correctly', () => {
    render(
      <ProductCard 
        product={mockProduct}
        categoryName="Test Category"
        badges={{ isNew: true, isTrending: true }}
      />
    );

    expect(screen.getByText(/new/i)).toBeInTheDocument();
    expect(screen.getByText(/trending/i)).toBeInTheDocument();
  });
});
