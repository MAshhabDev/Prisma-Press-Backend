import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";

const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getAllPosts();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get All Post Successfully",
      data: result,
    });
  },
);
const getPostStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getPostStats();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Stats Retrieved Successfully",
      data: result,
    });
  },
);

const getMyPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const result = await postService.getMyPosts(userId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Single Data Retrieved Successfully",
      data: result,
    });
  },
);

const getPostById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    if (!id) {
      throw new Error("Post Id Required");
    }

    const result = await postService.getPostById(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Single Data Retrieved Successfully",
      data: result,
    });
  },
);
const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;

    const payload = req.body;

    const result = await postService.createPost(payload, id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Post Creation Done",
      data: result,
    });
  },
);
const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;
    if (!postId) {
      throw new Error("No Post Id");
    }

    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";

    const payload = req.body;

    const result = await postService.updatePost(
      postId as string,
      payload,
      authorId as string,
      isAdmin,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Update Done",
      data: result,
    });
  },
);

const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;
    if (!postId) {
      throw new Error("No Post Id");
    }

    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";
    const result = await postService.deletePost(
      postId as string,
      authorId as string,
      isAdmin,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Deleted Done",
      data: null,
    });
  },
);

export const postController = {
  getAllPosts,
  getMyPost,
  getPostById,
  getPostStats,
  createPost,
  updatePost,
  deletePost,
};
