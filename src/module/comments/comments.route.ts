import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { commentController } from "./comments.controller";

const router = Router();

router.post("/", auth(Role.ADMIN, Role.USER), commentController.createComment);
