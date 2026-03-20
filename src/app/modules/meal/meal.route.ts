import express from "express";
import { UserRole } from "../../../../generated/prisma/enums";
import authMiddleware from "../../middleware/Auth";
import validateRequest from "../../middleware/ValidateRequest";
import { MealController } from "./meal.controller";
import { MealValidation } from "./meal.validation";

const router = express.Router();

router.get("/", MealController.getAllMeals);

router.get("/:id", MealController.getMealsById);

// get meal types
router.get("/types/list", MealController.getMealTypes);
// get dietary options
router.get("/dietary-options/list", MealController.getDietaryOptions);
// get cuisine options
router.get("/cuisine-options/list", MealController.getCuisineOptions);

router.post(
  "/",
  authMiddleware(UserRole.provider),
  validateRequest(MealValidation.mealCreateZodSchema),
  MealController.createMeal,
);

router.get(
  "/provider/meals",
  authMiddleware(UserRole.provider),
  MealController.getProviderMeals,
);

// popular meals for homepage
router.get("/popular/list", MealController.getPopularMeals);

router.put(
  "/:id",
  authMiddleware(UserRole.provider),
  validateRequest(MealValidation.mealUpdateZodSchema),
  MealController.updateMeal,
);

router.get(
  "/provider/orders",
  authMiddleware(UserRole.provider),
  MealController.getProviderOrders,
);

router.put(
  "/orders/:id/status",
  authMiddleware(UserRole.provider),
  MealController.updateOrderStatus,
);

router.delete(
  "/:id",
  authMiddleware(UserRole.provider),
  MealController.deleteMeal,
);

export const MealRoutes = router;
