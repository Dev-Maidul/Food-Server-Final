import { z } from "zod";

const createProviderProfileZodSchema = z.object({
  body: z.object({
    shopName: z.string().min(1, { message: "Shop name is required" }),
    description: z.string().optional(),
    address: z.string().min(1, { message: "Address is required" }),
    phone: z.string().min(1, { message: "Phone number is required" }),
    isOpen: z.boolean().optional().default(true),
  }),
});

const updateProviderProfileZodSchema = z.object({
  body: z.object({
    shopName: z.string().optional(),
    description: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    isOpen: z.boolean().optional(),
  }),
});

export const ProviderValidation = {
  createProviderProfileZodSchema,
  updateProviderProfileZodSchema,
};
