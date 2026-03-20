import { Request } from "express";
import { UserStatus } from "../../../../generated/prisma/enums";
import { prisma } from "../../../utils/prisma";
import { IUser } from "./user.interface";

const getCurrentUser = async (req: Request) => {
  return req.user;
};

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
  return (users as IUser[]) || [];
};

const updateUserStatus = async (userId: string, newStatus: UserStatus) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status: newStatus },
  });
  return updatedUser as IUser;
};

const updateProfile = async (
  req: Request,
  data: { name?: string; phone?: string; image?: string },
) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.phone && { phone: data.phone }),
      ...(data.image && { image: data.image }),
    },
  });
  return updatedUser as IUser;
};

export const UserService = {
  getCurrentUser,
  getAllUsers,
  updateUserStatus,
  updateProfile,
};
