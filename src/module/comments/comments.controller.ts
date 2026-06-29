import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commentService } from "./comments.service";
import { sendResponse } from "../../utils/sendResponse";

import httpStatus from "http-status";

const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const authorId = req.user?.id;
    const result = await commentService.createComments(
      authorId as string,
      payload,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Comment created successfully",
      data: result,
    });
  },
);

const getCommentByAuthorId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.params.id;
    const result = await commentService.getCommentByAuthorId(
      authorId as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Author comment get successfully",
      data: result,
    });
  },
);

const getCommentByCommentId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;

    const result = await commentService.getCommentByCommentId(postId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment retrieved successfully",
      data: result,
    });
  },
);

const updateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const authorId = req.user?.id;
    const commentId = req.params.id;
    const result = await commentService.updateComment(
      commentId as string,
      payload,
      authorId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment updated successfully",
      data: result,
    });
  },
);

export const commentController = {
  createComment,
  getCommentByAuthorId,
  getCommentByCommentId,
  updateComment,
};
