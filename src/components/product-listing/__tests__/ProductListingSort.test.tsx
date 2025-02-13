import { render, screen, fireEvent } from '@testing-library/react';
import { ProductListingSort } from '../ProductListingSort';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('ProductListingSort', () => {
  const mockOnSortChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sort options correctly', () => {
    render(
      <ProductListingSort
        currentSort="price_asc"
        onSortChange={mockOnSortChange}
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText(/sort by/i)).toBeInTheDocument();
  });

  it('calls onSortChange when a sort option is selected', () => {
    render(
      <ProductListingSort
        currentSort="price_asc"
        onSortChange={mockOnSortChange}
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'price_desc' } });

    expect(mockOnSortChange).toHaveBeenCalledWith('price_desc');
  });

  it('handles sort change correctly', async () => {
    render(
      <ProductListingSort 
        currentSort="created_at_desc" 
        onSortChange={mockOnSortChange} 
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.click(select);

    const option = screen.getByText(/Price: High to Low/i);
    fireEvent.click(option);

    expect(mockOnSortChange).toHaveBeenCalledWith('price_desc');
  });

  it('displays current sort option', () => {
    render(
      <ProductListingSort 
        currentSort="price_asc" 
        onSortChange={mockOnSortChange} 
      />
    );

    expect(screen.getByText(/Price: Low to High/i)).toBeInTheDocument();
  });
});
