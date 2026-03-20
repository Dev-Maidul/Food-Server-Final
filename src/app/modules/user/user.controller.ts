import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IUser } from "./user.interface";
import { UserService } from "./user.service";

const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getCurrentUser(req);
  sendResponse<IUser>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Current user retrieved successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers();
  sendResponse<IUser[]>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All users retrieved successfully",
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id as string;
  const newStatus = req.body.status;

  const result = await UserService.updateUserStatus(userId, newStatus);
  sendResponse<IUser>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User status updated successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.updateProfile(req, req.body);
  sendResponse<IUser>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

export const UserController = {
  getCurrentUser,
  getAllUsers,
  updateUserStatus,
  updateProfile,
};
