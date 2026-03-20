import { z } from "zod";

export const OrderValidation = {
  createOrderSchema: z.object({
    body: z.object({
      providerId: z.string().uuid(),
      address: z.string().min(5),
      items: z
        .array(
          z.object({
            mealId: z.string().uuid(),
            quantity: z.number().min(1),
          }),
        )
        .min(1),
    }),
  }),

  updateOrderStatusSchema: z.object({
    body: z.object({
      status: z.enum([
        "PENDING",
        "ACCEPTED",
        "COOKING",
        "ON_THE_WAY",
        "DELIVERED",
        "CANCELLED",
      ]),
    }),
  }),
};
