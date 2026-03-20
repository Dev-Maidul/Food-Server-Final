type IOptions = {
  page?: number;
  limit?: number;
  sortBy?: "price" | "calories" | "name" | "createdAt";
  sortOrder?: "asc" | "desc";
};

type IOptionsResults = {
  page: number;
  limit: number;
  skip: number;
  sortBy?: "price" | "calories" | "name" | "createdAt";
  sortOrder?: "asc" | "desc";
};
const paginationSortingHelper = (options: IOptions): IOptionsResults => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy: "price" | "calories" | "name" | "createdAt" =
    options.sortBy || "createdAt";
  const sortOrder: "asc" | "desc" = options.sortOrder || "desc";
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};
export default paginationSortingHelper;
