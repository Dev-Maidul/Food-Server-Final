import z from "zod";

export const UserValidation = {
  userZodSchema: z.object({
    body: z.object({
      name: z.string().min(2, "Name must be at least 2 characters long"),
    }),
  }),
};
