import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { userController } from "./user.controller";
import { catchAsync } from "../../utils/catchAsync";
import { jwtUtils } from "../../utils/jwt";
import { config } from "../../config";
import type { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";

const router = Router();

router.post("/register", userController.createUser);

const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;

    if (!token) {
      throw new Error("Invalid Token");
    }

    const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }

    const { email, name, id, role } = verifiedToken.data as JwtPayload;

    if (!requiredRoles.includes(role)) {
      throw new Error("Forbidden");
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
        email,
        name,
        role,
      },
    });

    if (!user) {
      throw new Error("User Not Found");
    }

    if (user.activeStatus === "BLOCKED") {
      throw new Error("Your Account Has been Blocked");
    }

    req.user = {
      email,
      name,
      id,
      role,
    };
  });
};
router.post("/me", userController.getMyProfile);

export const userRoutes = router;
