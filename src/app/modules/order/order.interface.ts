import { OrderStatus } from "../../../../generated/prisma/enums";

export interface CreateOrderPayload {
  providerId: string;
  address: string;
  items: {
    mealId: string;
    quantity: number;
  }[];
}

export interface OrderFilterPayload {
  status?: OrderStatus;
}
