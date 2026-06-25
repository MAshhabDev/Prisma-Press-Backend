import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../../config";
import type { ILogin } from "./auth.interface";

const logInUserInToDb = async (payload: ILogin) => {
  const { email, password } = payload;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email,
    },
  });


  const matchPass = await bcrypt.compare(password, user.password);

  if (!matchPass) {
    throw new Error("Password is incorrect");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret, {
    expiresIn: config.jwt_access_expires_in,
  } as SignOptions);

  const refreshToken = jwt.sign(jwtPayload, config.jwt_refresh_secret, {
    expiresIn: config.jwt_refresh_expires_in,
  } as SignOptions);

  return { accessToken, refreshToken };
};

export const authService = { logInUserInToDb };
