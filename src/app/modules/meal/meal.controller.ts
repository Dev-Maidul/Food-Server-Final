import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import paginationSortingHelper from "../../../helper/PaginationSortingHelper";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IMeal, MealFilterPayload, MealListResponse } from "./meal.interface";
import { MealService } from "./meal.service";

const createMeal = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  console.log(req.body);
  const result = await MealService.createMeal({ ...req.body, userId });
  sendResponse<IMeal>(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Meal created successfully",
    data: result,
  });
});

const getAllMeals = catchAsync(async (req: Request, res: Response) => {
  const payload = req.query as unknown as MealFilterPayload;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationSortingHelper(payload);
  const result = await MealService.getAllMeals({
    ...payload,
    page,
    limit,
    skip,
    ...(sortBy && { sortBy }),
    ...(sortOrder && { sortOrder }),
  });
  sendResponse<MealListResponse>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Meals retrieved successfully",
    data: result,
  });
});

const getMealsById = catchAsync(async (req: Request, res: Response) => {
  const mealId = req.params.id;
  const result = await MealService.getMealsById(mealId as string);
  sendResponse<IMeal>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Meal retrieved successfully",
    data: result,
  });
});

// get their own provider meals
const getProviderMeals = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const result = await MealService.getProviderMeals(userId as string);
  sendResponse<MealListResponse>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Provider meals retrieved successfully",
    data: result,
  });
});
// update their own provider meals
const updateMeal = catchAsync(async (req: Request, res: Response) => {
  const mealId = req.params.id;
  const userId = req.user?.id;
  const result = await MealService.updateMeal(
    mealId as string,
    userId as string,
    req.body,
  );
  sendResponse<IMeal>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Meal updated successfully",
    data: result,
  });
});
// delete their own provider meals
const deleteMeal = catchAsync(async (req: Request, res: Response) => {
  const mealId = req.params.id as string;
  const userId = req.user?.id as string;
  const result = await MealService.deleteMeal(mealId, userId);
  sendResponse<IMeal>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Meal deleted successfully",
    data: result,
  });
});

// get their own provider orders
const getProviderOrders = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const result = await MealService.getProviderOrders(userId as string);
  sendResponse<MealListResponse>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Provider orders retrieved successfully",
    data: result,
  });
});

// Update order status their own provider orders
const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const orderId = req.params.id;
  const status = req.body.status;
  const result = await MealService.updateOrderStatus(
    userId as string,
    orderId as string,
    status,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Order status updated successfully",
    data: result,
  });
});

// Get Meal Types
const getMealTypes = catchAsync(async (req: Request, res: Response) => {
  const result = await MealService.getMealTypes();
  sendResponse<string[]>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Meal types retrieved successfully",
    data: result,
  });
});

// get dietary options
const getDietaryOptions = catchAsync(async (req: Request, res: Response) => {
  const result = await MealService.getDietaryOptions();
  sendResponse<string[]>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Dietary options retrieved successfully",
    data: result,
  });
});

// get Cuisine Options
const getCuisineOptions = catchAsync(async (req: Request, res: Response) => {
  const result = await MealService.getCuisineOptions();
  sendResponse<string[]>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Cuisine options retrieved successfully",
    data: result,
  });
});

// popular meals for homepage
const getPopularMeals = catchAsync(async (req: Request, res: Response) => {
  const result = await MealService.getPopularMeals();
  sendResponse<MealListResponse>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Popular meals retrieved successfully",
    data: result,
  });
});

export const MealController = {
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
