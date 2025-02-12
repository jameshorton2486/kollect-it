
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../ProductCard';
import { useCart } from '@/contexts/CartContext';
import { vi } from 'vitest';

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
};

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

  it('handles image load error correctly', () => {
    render(
      <ProductCard 
        product={mockProduct}
        categoryName="Test Category"
      />
    );

    const img = screen.getByAltText(mockProduct.name);
    fireEvent.error(img);
    
    expect(img).toHaveAttribute('src', '/placeholder.svg');
  });

  it('shows quick add button on hover', async () => {
    render(
      <ProductCard 
        product={mockProduct}
        categoryName="Test Category"
      />
    );

    const productDiv = screen.getByRole('article');
    fireEvent.mouseEnter(productDiv);

    expect(screen.getByText(/Quick Add/)).toBeVisible();
  });

  it('handles add to cart action', async () => {
    const mockAddItem = vi.fn();
    (useCart as jest.Mock).mockImplementation(() => ({
      addItem: mockAddItem,
    }));

    render(
      <ProductCard 
        product={mockProduct}
        categoryName="Test Category"
      />
    );

    const productDiv = screen.getByRole('article');
    fireEvent.mouseEnter(productDiv);
    
    const addButton = screen.getByText(/Quick Add/);
    fireEvent.click(addButton);

    expect(mockAddItem).toHaveBeenCalledWith(mockProduct.id);
  });
});
