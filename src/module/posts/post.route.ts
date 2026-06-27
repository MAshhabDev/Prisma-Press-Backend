import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/");

router.get("/stats", auth(Role.ADMIN));
router.get("/my-posts", auth(Role.ADMIN, Role.USER));
router.get("/:id");
router.post("/", auth(Role.ADMIN));
router.patch("/id", auth(Role.ADMIN, Role.USER));
router.delete("/id", auth(Role.ADMIN, Role.USER));
