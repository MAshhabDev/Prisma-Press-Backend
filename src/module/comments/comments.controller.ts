import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commentService } from "./comments.service";
import { auth } from "../../middlewares/auth";
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

export const commentController = { createComment };
