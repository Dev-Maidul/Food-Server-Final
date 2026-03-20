import express from "express";
import { UserRole } from "../../../../generated/prisma/enums";
import authMiddleware from "../../middleware/Auth";
import { UserController } from "./user.controller";

const router = express.Router();

router.get(
  "/me",
  authMiddleware(UserRole.admin, UserRole.customer, UserRole.provider),
  UserController.getCurrentUser,
);

router.get("/", authMiddleware(UserRole.admin), UserController.getAllUsers);

router.patch(
  "/:id",
  authMiddleware(UserRole.admin),
  UserController.updateUserStatus,
);

router.patch(
  "/profile/update",
  authMiddleware(UserRole.admin, UserRole.customer, UserRole.provider),
  UserController.updateProfile,
);

export const UserRoutes = router;
