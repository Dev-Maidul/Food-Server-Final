import express from "express";
import { UserRole } from "../../../../generated/prisma/enums";
import authMiddleware from "../../middleware/Auth";
import { reviewController } from "./review.controller";

const router = express.Router();

// Create a new review (authenticated users only)
router.post(
  "/",
  authMiddleware(UserRole.customer),
  reviewController.createReview,
);

// Get all reviews for a specific meal (public)
router.get("/meal/:mealId", reviewController.getMealReviews);

// Get user's own reviews (authenticated users only)
router.get(
  "/user",
  authMiddleware(UserRole.customer),
  reviewController.getUserReviews,
);

// Get provider's reviews for their meals (authenticated providers only)
router.get(
  "/provider",
  authMiddleware(UserRole.provider),
  reviewController.getProviderReviews,
);

// Update a review (authenticated users only)
router.put(
  "/:reviewId",
  authMiddleware(UserRole.customer),
  reviewController.updateReview,
);

// Delete a review (authenticated users only)
router.delete(
  "/:reviewId",
  authMiddleware(UserRole.customer),
  reviewController.deleteReview,
);

export const reviewRoutes = router;
