import { StatusCodes } from "http-status-codes";
import { prisma } from "../../../utils/prisma";
import ApiError from "../../errors/ApiError";

interface CreateReviewData {
  userId: string;
  mealId: string;
  rating: number;
  comment?: string;
}

interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

// Create a new review
const createReview = async (data: CreateReviewData) => {
  const { userId, mealId, rating, comment } = data;

  // Validate rating
  if (rating < 1 || rating > 5) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Rating must be between 1 and 5",
    );
  }

  // Check if meal exists
  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
  });

  if (!meal) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Meal not found");
  }

  // Check if user has already reviewed this meal
  const existingReview = await prisma.review.findFirst({
    where: {
      userId,
      mealId,
    },
  });

  if (existingReview) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "You have already reviewed this meal",
    );
  }

  // Check if user has ordered this meal and it's delivered
  const hasOrdered = await prisma.order.findFirst({
    where: {
      userId,
      status: "DELIVERED",
      items: {
        some: {
          mealId,
        },
      },
    },
  });

  if (!hasOrdered) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "You can only review meals you have ordered and received",
    );
  }

  // Create the review
  const review = await prisma.review.create({
    data: {
      userId,
      mealId,
      rating,
      comment: comment || null,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      meal: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return review;
};

// Get all reviews for a specific meal
const getMealReviews = async (mealId: string) => {
  const reviews = await prisma.review.findMany({
    where: { mealId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) /
        reviews.length
      : 0;

  return {
    reviews,
    averageRating,
    totalReviews: reviews.length,
  };
};

// Get all reviews by a user
const getUserReviews = async (userId: string) => {
  const reviews = await prisma.review.findMany({
    where: { userId },
    include: {
      meal: {
        select: {
          id: true,
          name: true,
          image: true,
          price: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};

// Get all reviews for provider's meals
const getProviderReviews = async (providerId: string) => {
  // Get all meals for the provider
  const providerMeals = await prisma.meal.findMany({
    where: { providerId },
    select: { id: true },
  });

  const mealIds = providerMeals.map((meal) => meal.id);

  // Get all reviews for those meals
  const reviews = await prisma.review.findMany({
    where: {
      mealId: {
        in: mealIds,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      meal: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Calculate overall statistics
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) /
        totalReviews
      : 0;

  // Group by rating
  const ratingDistribution = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  return {
    reviews,
    totalReviews,
    averageRating,
    ratingDistribution,
  };
};

// Update a review
const updateReview = async (
  reviewId: string,
  userId: string,
  data: UpdateReviewData,
) => {
  // Check if review exists and belongs to user
  const existingReview = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!existingReview) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Review not found");
  }

  if (existingReview.userId !== userId) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "You can only update your own reviews",
    );
  }

  // Validate rating if provided
  if (data.rating && (data.rating < 1 || data.rating > 5)) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Rating must be between 1 and 5",
    );
  }

  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      meal: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return updatedReview;
};

// Delete a review
const deleteReview = async (reviewId: string, userId: string) => {
  // Check if review exists and belongs to user
  const existingReview = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!existingReview) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Review not found");
  }

  if (existingReview.userId !== userId) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "You can only delete your own reviews",
    );
  }

  await prisma.review.delete({
    where: { id: reviewId },
  });

  return { message: "Review deleted successfully" };
};

export const reviewService = {
  createReview,
  getMealReviews,
  getUserReviews,
  getProviderReviews,
  updateReview,
  deleteReview,
};
