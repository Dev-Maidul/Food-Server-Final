import { Response } from "express";

const sendResponse = <T>(
  res: Response,
  jsonData: {
    statusCode: number;
    success: boolean;
    message?: string;
    token?: string;
    meta?: {
      page: number;
      limit: number;
      total: number;
    };
    data?: T | null | undefined;
  }
) => {
  const response: any = {
    success: jsonData.success,
  };

  if (jsonData.message) response.message = jsonData.message;
  if (jsonData.token) response.token = jsonData.token;
  if (jsonData.meta) response.meta = jsonData.meta;
  if (jsonData.data !== undefined && jsonData.data !== null)
    response.data = jsonData.data;

  res.status(jsonData.statusCode).json(response);
};

export default sendResponse;
