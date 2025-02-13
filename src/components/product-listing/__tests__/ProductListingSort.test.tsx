import { render, screen, fireEvent } from '@testing-library/react';
import { ProductListingSort } from '../ProductListingSort';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('ProductListingSort', () => {
  const mockOnValueChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sort options correctly', () => {
    render(
      <ProductListingSort
        value="price_asc"
        onValueChange={mockOnValueChange}
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText(/sort by/i)).toBeInTheDocument();
  });

  it('calls onValueChange when a sort option is selected', () => {
    render(
      <ProductListingSort
        value="price_asc"
        onValueChange={mockOnValueChange}
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'price_desc' } });

    expect(mockOnValueChange).toHaveBeenCalledWith('price_desc');
  });

  it('handles sort change correctly', async () => {
    render(
      <ProductListingSort 
        value="created_at_desc" 
        onValueChange={mockOnValueChange} 
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.click(select);

    const option = screen.getByText(/Price: High to Low/i);
    fireEvent.click(option);

    expect(mockOnValueChange).toHaveBeenCalledWith('price_desc');
  });

  it('displays current sort option', () => {
    render(
      <ProductListingSort 
        value="price_asc" 
        onValueChange={mockOnValueChange} 
      />
    );

    expect(screen.getByText(/Price: Low to High/i)).toBeInTheDocument();
  });
});
