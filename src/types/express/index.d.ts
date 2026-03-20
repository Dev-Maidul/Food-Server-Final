import { UserRole, UserStatus } from "../../../generated/prisma/enums";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
        phone: string;
        status: UserStatus;
        emailVerified: boolean;
        createdAt?: Date;
        updatedAt?: Date;
      };
    }
  }
}
