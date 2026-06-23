import cookieParser from "cookie-parser";
import express, { Application, type Request, type Response } from "express";

import cors from "cors";
import { config } from "./config";
import { prisma } from "./lib/prisma";

import bcrypt from "bcrypt";
import httpStatus from "http-status";

export const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.post("/api/users/register", async (req: Request, res: Response) => {
  const { name, email, password, profile } = req.body;
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUserExist) {
    throw new Error("User with this email already exists");
  }

  const hashPass = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPass,
    },
  });

  await prisma.profile.create({
    data: {
      userId: createUser.id,
      profile,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: createUser.id,
      email: createUser.email,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  res.status(httpStatus.CREATED).json({
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: {
      user,
    },
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});
