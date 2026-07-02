import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { subscriptionController } from "./subscription.controller";

const router = Router();

router.post(
  "/",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  subscriptionController.createCheckoutSession,
);

export const subscriptionRoutes = router;
