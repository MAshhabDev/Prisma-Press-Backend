import cookieParser from "cookie-parser";
import express, { Application, type Request, type Response } from "express";

import cors from "cors";
import { config } from "./config";
import { prisma } from "./lib/prisma";

import bcrypt from "bcrypt";
import { userRoutes } from "./module/users/user.route";
import { authRouters } from "./module/auth/auth.route";
import { postRoutes } from "./module/posts/post.route";
import { commentRoutes } from "./module/comments/comments.route";
import { notFound } from "./middlewares/notfound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { subscriptionRoutes } from "./module/subscription/subscription.route";

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



app.use("/api/users", userRoutes)
app.use("/api/auth", authRouters)

app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/subscription",subscriptionRoutes)


app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.use(notFound)

app.use(globalErrorHandler)
