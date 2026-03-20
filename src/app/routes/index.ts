import express from "express";
import { CategoryRoutes } from "../modules/category/category.route";
import { MealRoutes } from "../modules/meal/meal.route";
import { OrderRoutes } from "../modules/order/order.route";
import { ProviderRoutes } from "../modules/provider/provider.route";
import { reviewRoutes } from "../modules/review/review.routes";
import { UserRoutes } from "../modules/user/user.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    routes: UserRoutes,
  },
  {
    path: "/providers",
    routes: ProviderRoutes,
  },
  {
    path: "/categories",
    routes: CategoryRoutes,
  },
  {
    path: "/meals",
    routes: MealRoutes,
  },
  {
    path: "/orders",
    routes: OrderRoutes,
  },
  {
    path: "/reviews",
    routes: reviewRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.routes));
export default router;
