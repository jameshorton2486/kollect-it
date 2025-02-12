
import { 
  loginSchema, 
  registerSchema, 
  productSchema,
  categorySchema,
  profileSchema,
  reviewSchema 
} from '../schemas';

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('validates correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };
      
      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };
      
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('validates correct registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      };
      
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects weak password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'weak',
        firstName: 'John',
        lastName: 'Doe',
      };
      
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('productSchema', () => {
    it('validates correct product data', () => {
      const validData = {
        name: 'Test Product',
        description: 'Test Description that is long enough',
        price: '99.99',
        category_id: '123e4567-e89b-12d3-a456-426614174000',
        condition: 'new',
      };
      
      const result = productSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid price', () => {
      const invalidData = {
        name: 'Test Product',
        description: 'Test Description that is long enough',
        price: '-10',
        category_id: '123e4567-e89b-12d3-a456-426614174000',
        condition: 'new',
      };
      
      const result = productSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('categorySchema', () => {
    it('validates correct category data', () => {
      const validData = {
        name: 'Test Category',
        description: 'Test Description',
        subcategories: [{ id: '1', value: 'Test Subcategory' }],
      };
      
      const result = categorySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('allows empty subcategories', () => {
      const validData = {
        name: 'Test Category',
        description: 'Test Description',
      };
      
      const result = categorySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('profileSchema', () => {
    it('validates correct profile data', () => {
      const validData = {
        first_name: 'John',
        last_name: 'Doe',
        avatar_url: 'https://example.com/avatar.jpg',
      };
      
      const result = profileSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('allows missing avatar_url', () => {
      const validData = {
        first_name: 'John',
        last_name: 'Doe',
      };
      
      const result = profileSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('reviewSchema', () => {
    it('validates correct review data', () => {
      const validData = {
        rating: 5,
        comment: 'This is a great product with detailed feedback',
      };
      
      const result = reviewSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid rating', () => {
      const invalidData = {
        rating: 6,
        comment: 'This is a great product',
      };
      
      const result = reviewSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
