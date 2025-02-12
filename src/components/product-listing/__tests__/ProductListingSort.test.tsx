
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductListingSort } from '../ProductListingSort';
import { vi } from 'vitest';

describe('ProductListingSort', () => {
  const mockOnSortChange = vi.fn();

  beforeEach(() => {
    mockOnSortChange.mockClear();
  });

  it('renders sort options correctly', () => {
    render(
      <ProductListingSort 
        sortBy="created_at_desc" 
        onSortChange={mockOnSortChange} 
      />
    );

    expect(screen.getByText(/Sort by:/i)).toBeInTheDocument();
    expect(screen.getByText(/Newest First/i)).toBeInTheDocument();
  });

  it('handles sort change correctly', async () => {
    render(
      <ProductListingSort 
        sortBy="created_at_desc" 
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
        sortBy="price_asc" 
        onSortChange={mockOnSortChange} 
      />
    );

    expect(screen.getByText(/Price: Low to High/i)).toBeInTheDocument();
  });
});
