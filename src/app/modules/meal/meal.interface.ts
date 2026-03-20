export interface IMeal {
  name: string;
  calories: number;
  ingredients: string[];
  description?: string | undefined;
  price: number;
  image?: string | undefined;
  isAvailable: boolean;
  categoryId: string;
  providerId: string;
  dietary: string[];
  cuisine: string;
  mealType: string;
  spiceLevel: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UpdateMealPayload = {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  isAvailable?: boolean;
  calories?: number;
  ingredients?: string[];
  categoryId?: string;
  dietary?: string[];
  cuisine?: string;
  mealType?: string;
  spiceLevel?: string;
};

// Filter meals by cuisine, dietary preferences, and price

export interface MealFilterPayload {
  search?: string;
  dietary?: string;
  cuisine?: string;
  mealType?: string;
  spiceLevel?: string;
  page?: number;
  limit?: number;
  skip?: number;
  totalPages?: number;
  totalItems?: number;
  sortBy?: "price" | "calories" | "name" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface MealListResponse {
  data: IMeal[];
  pagination: {
    total: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}
