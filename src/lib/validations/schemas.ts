import * as z from "zod";

// User-related schemas
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

// Product-related schemas
export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a valid number greater than 0",
  }),
  category_id: z.string().uuid("Please select a valid category"),
  condition: z.string().min(1, "Please select a condition"),
  era: z.string().optional(),
  estimated_age: z.string().optional(),
  provenance: z.string().optional(),
});

// Category-related schemas
export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  description: z.string().optional(),
  subcategories: z.array(
    z.object({
      id: z.string(),
      value: z.string().min(2, "Subcategory must be at least 2 characters"),
    })
  ).default([]),
});

// Profile-related schemas
export const profileSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  avatar_url: z.string().optional(),
});

// Review-related schemas
export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Review comment must be at least 10 characters"),
});