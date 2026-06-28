import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { postController } from "./post.controller";
import { userController } from "../users/user.controller";

const router = Router();

router.get("/", postController.getAllPosts);

router.get("/stats", auth(Role.ADMIN), postController.getPostStats);
router.get("/my-posts", auth(Role.ADMIN, Role.USER), postController.getMyPost);
router.get("/:id", postController.getPostById);
router.post("/", auth(Role.ADMIN), postController.createPost);
router.patch("/id", auth(Role.ADMIN, Role.USER), postController.updatePost);
router.delete("/id", auth(Role.ADMIN, Role.USER), postController.deletePost);
