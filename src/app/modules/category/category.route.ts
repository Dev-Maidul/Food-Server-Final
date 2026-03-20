import express from "express";
import { UserRole } from "../../../../generated/prisma/enums";
import authMiddleware from "../../middleware/Auth";
import validateRequest from "../../middleware/ValidateRequest";
import { CategoryController } from "./category.controller";
import { CategoryValidation } from "./category.validation";

const router = express.Router();

router.post(
  "/",
  authMiddleware(UserRole.admin),
  validateRequest(CategoryValidation.categoryZodSchema),
  CategoryController.createCategory,
);
router.get("/", CategoryController.getAllCategories);
router.patch(
  "/:id",
  authMiddleware(UserRole.admin),
  validateRequest(CategoryValidation.categoryZodSchema),
  CategoryController.updateCategory,
);
router.delete(
  "/:id",
  authMiddleware(UserRole.admin),
  CategoryController.deleteCategory,
);

export const CategoryRoutes = router;
