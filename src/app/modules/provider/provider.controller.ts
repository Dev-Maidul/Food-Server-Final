import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ProviderService } from "./provider.service";

const createProviderProfile = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const result = await ProviderService.createProviderProfile({
      ...req.body,
      userId,
    });
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Provider profile created successfully",
      data: result,
    });
  },
);

const getAllProviders = catchAsync(async (req: Request, res: Response) => {
  const result = await ProviderService.getAllProviders();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Providers retrieved successfully",
    data: result,
  });
});

const getProviderById = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.params.id;
  const result = await ProviderService.getProviderById(providerId as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Provider retrieved successfully",
    data: result,
  });
});

export const ProviderController = {
  createProviderProfile,
  getAllProviders,
  getProviderById,
};
