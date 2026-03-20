import { ZodError } from "zod";

export const handleZodError = (error: ZodError) => {
  return error.issues.map((issue) => {
    return {
      field: issue.path[1] || issue.path[0],
      location: issue.path[0],
      message: issue.message,
    };
  });
};
