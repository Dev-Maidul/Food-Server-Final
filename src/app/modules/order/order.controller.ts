import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { OrderService } from "./order.service";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const orderData = req.body;
  const result = await OrderService.createOrder(orderData, userId);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Order created successfully",
    data: result,
  });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const result = await OrderService.getMyOrders(userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Orders retrieved successfully",
    data: result,
  });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const orderId = req.params.id as string;
  const result = await OrderService.getOrderById(orderId, userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Order retrieved successfully",
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.id as string;
  const status = req.body.status as string;
  const providerId = req.user?.id as string;
  const result = await OrderService.updateOrderStatus(
    orderId,
    status,
    providerId,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Order status updated successfully",
    data: result,
  });
});

// Customer track their own order status
const trackOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.id as string;
  const userId = req.user?.id as string;
  const result = await OrderService.trackOrderStatus(orderId, userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Order status tracked successfully",
    data: result,
  });
});

// Customer cancels their own order
const cancelOrder = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.id as string;
  const userId = req.user?.id as string;
  const result = await OrderService.cancelOrder(orderId, userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Order cancelled successfully",
    data: result,
  });
});

// get all orders - admin only
const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getAllOrders();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All orders retrieved successfully",
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  trackOrderStatus,
  cancelOrder,
  getAllOrders,
};
