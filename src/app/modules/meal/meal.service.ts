import { StatusCodes } from "http-status-codes";
import { OrderStatus } from "../../../../generated/prisma/enums";
import { buildMealQueryCondition } from "../../../helper/QueryHelper";
import { prisma } from "../../../utils/prisma";
import ApiError from "../../errors/ApiError";
import {
  IMeal,
  MealFilterPayload,
  MealListResponse,
  UpdateMealPayload,
} from "./meal.interface";

const createMeal = async (payload: IMeal & { userId?: string }) => {
  const {
    name,
    calories,
    ingredients,
    description,
    price,
    image,
    isAvailable,
    categoryId,
    dietary,
    cuisine,
    mealType,
    spiceLevel,
    userId,
  } = payload;

  const result = await prisma.$transaction(async (tx) => {
    const providerFind = await tx.providerProfile.findUnique({
      where: { userId: userId as string },
    });
    console.log(providerFind);

    if (!providerFind) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Provider profile not found for this user",
      );
    }

    const data = await tx.meal.create({
      data: {
        name,
        calories: Number(calories),
        ingredients,
        description: description ?? null,
        price: Number(price),
        image: image ?? null,
        isAvailable,
        categoryId,
        providerId: providerFind.id,
        dietary,
        cuisine,
        mealType,
        spiceLevel,
      },
    });
    return data;
  });

  return result as IMeal;
};

const getAllMeals = async (
  payload: MealFilterPayload,
): Promise<MealListResponse> => {
  const meals = await prisma.meal.findMany({
    take: Number(payload.limit),
    skip: Number(payload.skip),
    where: buildMealQueryCondition(payload),
    ...(payload.sortBy && { orderBy: { [payload.sortBy]: payload.sortOrder } }),
  });
  const total = await prisma.meal.count({
    where: buildMealQueryCondition(payload),
  });
  if (!meals || meals.length === 0) {
    throw new ApiError(StatusCodes.NOT_FOUND, "No meals found");
  }

  const totalPages = Math.ceil(total / Number(payload.limit));

  return {
    data: meals as IMeal[],
    pagination: {
      total,
      page: payload.page || 1,
      limit: payload.limit || 10,
      totalPages,
    },
  };
};

const getMealsById = async (mealId: string) => {
  const data = await prisma.meal.findUnique({
    where: { id: mealId },
    include: {
      reviews: true,
      category: true,
      provider: {
        select: {
          id: true,
          shopName: true,
          address: true,
        },
      },
    },
  });
  if (!data) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Meal not found");
  }
  return data as IMeal;
};

// get their own provider meals
const getProviderMeals = async (userId: string): Promise<MealListResponse> => {
  const providerProfile = await prisma.providerProfile.findUnique({
    where: { userId },
  });

  if (!providerProfile) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Provider profile not found");
  }

  const meals = await prisma.meal.findMany({
    where: { providerId: providerProfile.id },
    include: {
      category: true,
      reviews: true,
      provider: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    data: meals as IMeal[],
    pagination: {
      total: meals.length,
    },
  };
};
// update their own provider meals
const updateMeal = async (
  mealId: string,
  userId: string,
  payload: UpdateMealPayload,
) => {
  const providerProfile = await prisma.providerProfile.findUnique({
    where: { userId },
  });

  if (!providerProfile) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Provider profile not found");
  }

  const existingMeal = await prisma.meal.findFirst({
    where: {
      id: mealId,
      providerId: providerProfile.id,
    },
  });

  if (!existingMeal) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Meal not found");
  }

  const updatedMeal = await prisma.meal.update({
    where: { id: mealId },
    data: {
      ...payload,
      updatedAt: new Date(),
    },
  });

  return updatedMeal as IMeal;
};

const deleteMeal = async (mealId: string, userId: string) => {
  const providerProfile = await prisma.providerProfile.findUnique({
    where: { userId },
  });

  if (!providerProfile) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Provider profile not found");
  }

  const existingMeal = await prisma.meal.findFirst({
    where: {
      id: mealId,
      providerId: providerProfile.id,
    },
  });

  if (!existingMeal) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Meal not found");
  }

  // if has running orders, cannot delete
  const runningOrders = await prisma.order.findFirst({
    where: {
      status: {
        in: ["PENDING", "ACCEPTED", "COOKING", "ON_THE_WAY"],
      },
      items: {
        some: {
          mealId,
        },
      },
    },
  });

  if (runningOrders) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Cannot delete meal with running orders",
    );
  }

  const deletedMeal = await prisma.meal.delete({
    where: { id: mealId },
  });

  return deletedMeal as IMeal;
};

// get their own provider orders
const getProviderOrders = async (userId: string): Promise<MealListResponse> => {
  const providerProfile = await prisma.providerProfile.findUnique({
    where: { userId },
  });

  if (!providerProfile) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Provider profile not found");
  }

  const orders = await prisma.order.findMany({
    where: { providerId: providerProfile.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          meal: {
            select: {
              id: true,
              name: true,
              price: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    data: orders as unknown as IMeal[],
    pagination: {
      total: orders.length,
    },
  };
};
// review meals by popularity
const getPopularMeals = async (): Promise<MealListResponse> => {
  const meals = await prisma.meal.findMany({
    orderBy: {
      reviews: {
        _count: "desc",
      },
    },
    take: 8,
    include: {
      reviews: true,
      category: true,
      provider: {
        select: {
          id: true,
          shopName: true,
          address: true,
        },
      },
    },
  });

  return {
    data: meals as unknown as IMeal[],
    pagination: {
      total: meals.length,
    },
  };
};

// Get Meal Types
const getMealTypes = async (): Promise<string[]> => {
  const mealTypes = await prisma.meal.findMany({
    distinct: ["mealType"],
    select: {
      mealType: true,
    },
  });

  return mealTypes
    .map((meal) => meal.mealType)
    .filter((type): type is string => type !== null);
};

// Get Dietary Options
const getDietaryOptions = async (): Promise<string[]> => {
  const dietaryOptions = await prisma.meal.findMany({
    distinct: ["dietary"],
    select: {
      dietary: true,
    },
  });

  const dietarySet = new Set<string>();
  dietaryOptions.forEach((meal) => {
    meal.dietary.forEach((option) => dietarySet.add(option));
  });

  return Array.from(dietarySet);
};

// Get Cuisine Options
const getCuisineOptions = async (): Promise<string[]> => {
  const cuisines = await prisma.meal.findMany({
    distinct: ["cuisine"],
    select: {
      cuisine: true,
    },
  });
  return cuisines
    .map((meal) => meal.cuisine)
    .filter((cuisine): cuisine is string => cuisine !== null);
};

// Update order status their own provider orders
const updateOrderStatus = async (
  userId: string,
  orderId: string,
  status: string,
) => {
  const providerProfile = await prisma.providerProfile.findUnique({
    where: { userId },
  });

  if (!providerProfile) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Provider profile not found");
  }

  const existingOrder = await prisma.order.findFirst({
    where: {
      id: orderId,
      providerId: providerProfile.id,
    },
  });

  if (!existingOrder) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Order not found");
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: status as OrderStatus,
      updatedAt: new Date(),
    },
  });

  return updatedOrder;
};

export const MealService = {
  createMeal,
  getAllMeals,
  getMealsById,
  updateMeal,
  deleteMeal,
  getMealTypes,
  getDietaryOptions,
  getCuisineOptions,
  getProviderMeals,
  getProviderOrders,
  updateOrderStatus,
  getPopularMeals,
};
