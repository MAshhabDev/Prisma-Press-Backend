import type { NextFunction, Request, RequestHandler, Response } from "express";

import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.createUserInToDb(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully",
      data: {
        result,
      },
    });
  },
);

const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const { accessToken } = req.cookies;

    // const verifiedToken = jwtUtils.verifyToken(
    //   accessToken,
    //   config.jwt_access_secret,
    // );

    // if (typeof verifiedToken === "string") {
    //   throw new Error(verifiedToken);
    // }

    const result = await userService.getMyProfileInToDb(req.user?.id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Profile Fetched Successfully",
      data: { result },
    });
  },
);

const updateMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const { accessToken } = req.cookies;

    // const verifiedToken = jwtUtils.verifyToken(
    //   accessToken,
    //   config.jwt_access_secret,
    // );

    // if (typeof verifiedToken === "string") {
    //   throw new Error(verifiedToken);
    // }

    const id = req.user?.id as string;
    const payload = req.body;

    const result = await userService.updateMyProfileInToDb(id, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Profile Updated Successfully",
      data: { result },
    });
  },
);

export const userController = {
  createUser,
  getMyProfile,
  updateMyProfile,
};
