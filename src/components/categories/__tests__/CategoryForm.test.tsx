import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryForm, CategoryFormProps } from '../CategoryForm';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('CategoryForm', () => {
  const mockOnSubmit = vi.fn();
  const defaultValues = {
    name: '',
    description: '',
    parentId: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<CategoryForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('submits form with correct values', async () => {
    render(<CategoryForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /save/i });

    await userEvent.type(nameInput, 'Test Category');
    await userEvent.type(descriptionInput, 'Test Description');
    
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Test Category',
        description: 'Test Description',
        parentId: null,
      });
    });
  });

  it('validates required fields', async () => {
    render(<CategoryForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />);
    
    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    render(<CategoryForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    await userEvent.type(nameInput, 'Test Category');
    await userEvent.type(descriptionInput, 'Test Description');

    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Test Category',
        description: 'Test Description',
        parentId: null,
      });
    });
  });

  it('handles editing existing category', () => {
    const defaultValues = {
      name: 'Existing Category',
      description: 'Existing Description',
      parentId: null,
    };

    render(<CategoryForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />);

    expect(screen.getByLabelText(/name/i)).toHaveValue('Existing Category');
    expect(screen.getByLabelText(/description/i)).toHaveValue('Existing Description');
  });
});
