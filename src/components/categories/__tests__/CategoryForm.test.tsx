
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryForm } from '../CategoryForm';
import { vi } from 'vitest';

describe('CategoryForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders with default values', () => {
    render(<CategoryForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/Category Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<CategoryForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /Create Category/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Category name must be at least 2 characters/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    render(<CategoryForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/Category Name/i);
    const descriptionInput = screen.getByLabelText(/Description/i);

    await userEvent.type(nameInput, 'Test Category');
    await userEvent.type(descriptionInput, 'Test Description');

    const submitButton = screen.getByRole('button', { name: /Create Category/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Test Category',
        description: 'Test Description',
        subcategories: [],
      });
    });
  });

  it('handles editing existing category', () => {
    const defaultValues = {
      name: 'Existing Category',
      description: 'Existing Description',
      subcategories: [{ id: '1', value: 'Subcategory 1' }],
    };

    render(<CategoryForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />);

    expect(screen.getByLabelText(/Category Name/i)).toHaveValue('Existing Category');
    expect(screen.getByLabelText(/Description/i)).toHaveValue('Existing Description');
    expect(screen.getByDisplayValue('Subcategory 1')).toBeInTheDocument();
  });
});
