import z from "zod";

export const MealValidation = {
  mealCreateZodSchema: z.object({
    body: z.object({
      name: z.string().min(2, "Name must be at least 2 characters long"),
      calories: z.number().min(0, "Calories must be a positive number"),
      ingredients: z
        .array(z.string())
        .min(1, "At least one ingredient is required"),
      dietary: z
        .array(z.string())
        .min(1, "At least one dietary preference is required"),
      cuisine: z
        .string()
        .min(2, "Cuisine must be at least 2 characters long")
        .optional(),
      description: z.string().optional(),
      price: z.number().min(0, "Price must be a positive number"),
      image: z.string().url("Image must be a valid URL").optional(),
      isAvailable: z.boolean().optional().default(true),
      categoryId: z.string().uuid("Category ID must be a valid UUID"),
      mealType: z.string().optional(),
      spiceLevel: z.string().optional(),
    }),
  }),
  mealUpdateZodSchema: z.object({
    body: z.object({
      name: z
        .string()
        .min(2, "Name must be at least 2 characters long")
        .optional(),
      calories: z
        .number()
        .min(0, "Calories must be a positive number")
        .optional(),
      ingredients: z
        .array(z.string())
        .min(1, "At least one ingredient is required")
        .optional(),
      description: z.string().optional(),
      price: z.number().min(0, "Price must be a positive number").optional(),
      image: z.string().url("Image must be a valid URL").optional(),
      isAvailable: z.boolean().optional(),
      categoryId: z
        .string()
        .uuid("Category ID must be a valid UUID")
        .optional(),
    }),
  }),
};
