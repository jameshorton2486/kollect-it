import {
  loginSchema,
  registerSchema,
  productSchema,
  categorySchema,
  profileSchema,
  reviewSchema 
} from '../schemas';
import { describe, it, expect } from 'vitest';

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('validates correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123!'
      };
      
      expect(() => loginSchema.parse(validData)).not.toThrow();
    });

    it('rejects invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'Password123!'
      };
      
      expect(() => loginSchema.parse(invalidData)).toThrow();
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
      
      expect(() => registerSchema.parse(validData)).not.toThrow();
    });

    it('rejects weak password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'weak',
        firstName: 'John',
        lastName: 'Doe',
      };
      
      expect(() => registerSchema.parse(invalidData)).toThrow();
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
      
      expect(() => productSchema.parse(validData)).not.toThrow();
    });

    it('rejects invalid price', () => {
      const invalidData = {
        name: 'Test Product',
        description: 'Test Description that is long enough',
        price: '-10',
        category_id: '123e4567-e89b-12d3-a456-426614174000',
        condition: 'new',
      };
      
      expect(() => productSchema.parse(invalidData)).toThrow();
    });
  });

  describe('categorySchema', () => {
    it('validates correct category data', () => {
      const validData = {
        name: 'Test Category',
        description: 'Test Description',
        subcategories: [{ id: '1', value: 'Test Subcategory' }],
      };
      
      expect(() => categorySchema.parse(validData)).not.toThrow();
    });

    it('allows empty subcategories', () => {
      const validData = {
        name: 'Test Category',
        description: 'Test Description',
      };
      
      expect(() => categorySchema.parse(validData)).not.toThrow();
    });
  });

  describe('profileSchema', () => {
    it('validates correct profile data', () => {
      const validData = {
        first_name: 'John',
        last_name: 'Doe',
        avatar_url: 'https://example.com/avatar.jpg',
      };
      
      expect(() => profileSchema.parse(validData)).not.toThrow();
    });

    it('allows missing avatar_url', () => {
      const validData = {
        first_name: 'John',
        last_name: 'Doe',
      };
      
      expect(() => profileSchema.parse(validData)).not.toThrow();
    });
  });

  describe('reviewSchema', () => {
    it('validates correct review data', () => {
      const validData = {
        rating: 5,
        comment: 'This is a great product with detailed feedback',
      };
      
      expect(() => reviewSchema.parse(validData)).not.toThrow();
    });

    it('rejects invalid rating', () => {
      const invalidData = {
        rating: 6,
        comment: 'This is a great product',
      };
      
      expect(() => reviewSchema.parse(invalidData)).toThrow();
    });
  });
});
