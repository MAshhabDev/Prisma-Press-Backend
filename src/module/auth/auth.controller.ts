import type { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { ref } from "node:process";

const logInUser = async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken, refreshToken } = await authService.logInUserInToDb(
    req.body,
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 168,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Log In successfully done",
    data: { accessToken, refreshToken },
  });
};

export const authController = {
  logInUser,
};
