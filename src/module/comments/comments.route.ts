import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { commentController } from "./comments.controller";

const router = Router();

router.post("/", auth(Role.ADMIN, Role.USER), commentController.createComment);
router.get("/author/:authorId", commentController.getCommentByAuthorId);
router.get("/comments/:commentId", commentController.getCommentByCommentId);
router.patch(
  "/comments/:commentId",
  auth(Role.ADMIN, Role.USER),
  commentController.updateComment,
);
router.delete(
  "/comments/:commentId",
  auth(Role.ADMIN, Role.USER),
  commentController.updateComment,
);
