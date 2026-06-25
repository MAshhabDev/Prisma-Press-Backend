import type { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const logInUser = async (req: Request, res: Response, next: NextFunction) => {
  const result = await authService.logInUserInToDb(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Log In successfully done",
    data: result,
  });
};

export const authController = {
  logInUser,
};
