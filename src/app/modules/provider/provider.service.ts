import { StatusCodes } from "http-status-codes";
import { prisma } from "../../../utils/prisma";
import ApiError from "../../errors/ApiError";
import { IProviderProfile } from "./provider.interface";

// Create provider profile or shop
const createProviderProfile = async (payload: IProviderProfile) => {
  const { userId, shopName, description, address, phone, isOpen } = payload;
  const data = await prisma.$transaction(async (tx) => {
    const existingProfile = await tx.providerProfile.findUnique({
      where: { userId },
    });
    if (existingProfile) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "Provider profile already exists for this user",
      );
    }
    const user = await tx.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "User not found! Cannot create provider profile",
      );
    }

    const result = await tx.providerProfile.create({
      data: {
        userId,
        shopName,
        description: description ?? null,
        address,
        phone,
        isOpen: isOpen ?? true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
          },
        },
      },
    });
    if (user && !existingProfile) {
      await tx.user.update({
        where: { id: userId },
        data: { role: "provider" },
      });
    }
    return result;
  });

  return data;
};

// Browse all providers
const getAllProviders = async () => {
  const providers = await prisma.providerProfile.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      meals: {
        select: {
          id: true,
          name: true,
          price: true,
          isAvailable: true,
          reviews: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!providers) {
    throw new ApiError(StatusCodes.NOT_FOUND, "No providers found!");
  }

  return providers;
};
// View provider profiles with menus
const getProviderById = async (providerId: string) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { userId: providerId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      meals: {
        select: {
          id: true,
          name: true,
          price: true,
          isAvailable: true,
          reviews: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
  if (!provider) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Provider not found! Try again with valid id",
    );
  }

  return provider;
};

export const ProviderService = {
  createProviderProfile,
  getAllProviders,
  getProviderById,
};
