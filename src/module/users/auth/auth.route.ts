import { Router } from "express";
import { authController } from "../../auth/auth.controller";

const route = Router();

route.post("/", authController.logInUser);
