import { z } from 'zod';

// Email regex pattern for more comprehensive validation
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone regex pattern for basic phone validation
const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;

export const exampleFormSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters')
      .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),

    email: z
      .string()
      .min(1, 'Email is required')
      .regex(emailRegex, 'Please enter a valid email address')
      .max(100, 'Email must be less than 100 characters'),

    phone: z
      .string()
      .min(1, 'Phone number is required')
      .regex(phoneRegex, 'Please enter a valid phone number')
      .max(20, 'Phone number must be less than 20 characters'),

    age: z.number().optional(),

    country: z.string().min(1, 'Please select a country'),

    newsletter: z.boolean().default(false),

    // Conditional field - only required if newsletter is true
    preferences: z.string().optional(),

    // Optional message field
    message: z
      .string()
      .max(500, 'Message must be less than 500 characters')
      .optional(),
  })
  .refine(
    (data) => {
      // If newsletter is true, preferences must be provided
      return (
        !data.newsletter || (data.preferences && data.preferences.trim() !== '')
      );
    },
    {
      message: 'Please specify your newsletter preferences',
      path: ['preferences'],
    }
  );

// Infer TypeScript type from the schema
export type ExampleFormData = z.infer<typeof exampleFormSchema>;

// Export individual field schemas for reuse
export const emailSchema = z
  .string()
  .regex(emailRegex, 'Please enter a valid email address');
export const phoneSchema = z
  .string()
  .regex(phoneRegex, 'Please enter a valid phone number');
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');
