import { StatusCodes } from "http-status-codes";
import slugify from "slugify";
import { prisma } from "../../../utils/prisma";
import ApiError from "../../errors/ApiError";
import { ICategory } from "./category.interface";

const createCategory = async (payload: ICategory) => {
  const { name } = payload;
  const data = await prisma.category.create({
    data: {
      name,
      slug: slugify(name, {
        replacement: "-",
        lower: true,
        trim: true,
        remove: /[*+~.()'"!:@]/g,
        strict: true,
      }),
    },
  });
  if (!data) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create category");
  }
  return data;
};

const getAllCategories = async (): Promise<ICategory[]> => {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { meals: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return categories;
};

const updateCategory = async (id: string, payload: ICategory) => {
  const { name } = payload;

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
  }

  const data = await prisma.category.update({
    where: { id },
    data: {
      name,
      slug: slugify(name, {
        replacement: "-",
        lower: true,
        trim: true,
        remove: /[*+~.()'"!:@]/g,
        strict: true,
      }),
    },
  });

  return data;
};

const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { meals: true },
      },
    },
  });

  if (!category) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
  }

  if (category._count.meals > 0) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Cannot delete category with associated meals",
    );
  }

  await prisma.category.delete({
    where: { id },
  });

  return { message: "Category deleted successfully" };
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
