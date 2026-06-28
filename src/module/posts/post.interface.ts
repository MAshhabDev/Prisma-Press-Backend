import type { PostStatus } from "../../../generated/prisma/enums";

export interface ICreatePostPayload {
  title: string;
  content: string;
  thumbnail?: string;
  isFeatured?: boolean;
  views?: number;
  status?: PostStatus;
  tags: string[];
}

export interface IPayload {
  title?: string;
  content?: string;
  thumbnail?: string;
  isFeatured?: boolean;
  status?: PostStatus;
  tags?: string[];
}
