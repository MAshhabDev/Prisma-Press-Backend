import cookieParser from "cookie-parser";
import express, { Application, type Request, type Response } from "express";

import cors from "cors";
import { config } from "./config";

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

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});
