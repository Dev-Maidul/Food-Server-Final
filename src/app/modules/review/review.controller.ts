import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { prisma } from "../../../utils/prisma";
import { reviewService } from "./review.service";

// Create a new review
const createReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const { mealId, rating, comment } = req.body;

  if (!userId) {
    return sendResponse(res, {
      statusCode: StatusCodes.UNAUTHORIZED,
      success: false,
      message: "Unauthorized",
      data: null,
    });
  }

  const result = await reviewService.createReview({
    userId,
    mealId,
    rating,
    comment,
  });

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

// Get reviews for a specific meal
const getMealReviews = catchAsync(async (req: Request, res: Response) => {
  const { mealId } = req.params;

  const result = await reviewService.getMealReviews(mealId as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Reviews fetched successfully",
    data: result,
  });
});

// Get user's reviews
const getUserReviews = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;

  if (!userId) {
    return sendResponse(res, {
      statusCode: StatusCodes.UNAUTHORIZED,
      success: false,
      message: "Unauthorized",
      data: null,
    });
  }

  const result = await reviewService.getUserReviews(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User reviews fetched successfully",
    data: result,
  });
});

// Get provider's reviews (for all their meals)
const getProviderReviews = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;

  if (!userId) {
    return sendResponse(res, {
      statusCode: StatusCodes.UNAUTHORIZED,
      success: false,
      message: "Unauthorized",
      data: null,
    });
  }

  // Get provider profile
  const provider = await prisma.providerProfile.findUnique({
    where: { userId },
  });

  if (!provider) {
    return sendResponse(res, {
      statusCode: StatusCodes.FORBIDDEN,
      success: false,
      message: "Provider profile not found",
      data: null,
    });
  }

  const result = await reviewService.getProviderReviews(provider.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Provider reviews fetched successfully",
    data: result,
  });
});

// Update a review
const updateReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  if (!userId) {
    return sendResponse(res, {
      statusCode: StatusCodes.UNAUTHORIZED,
      success: false,
      message: "Unauthorized",
      data: null,
    });
  }

  const result = await reviewService.updateReview(reviewId as string, userId, {
    rating,
    comment,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Review updated successfully",
    data: result,
  });
});

// Delete a review
const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const { reviewId } = req.params;

  if (!userId) {
    return sendResponse(res, {
      statusCode: StatusCodes.UNAUTHORIZED,
      success: false,
      message: "Unauthorized",
      data: null,
    });
  }

  const result = await reviewService.deleteReview(reviewId as string, userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Review deleted successfully",
    data: result,
  });
});

export const reviewController = {
  createReview,
  getMealReviews,
  getUserReviews,
  getProviderReviews,
  updateReview,
  deleteReview,
};
