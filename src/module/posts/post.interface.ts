import type { PostStatus } from "../../../generated/prisma/enums";
import type { postWhereInput } from "../../../generated/prisma/models";

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


export interface IPostQuery extends postWhereInput {
    //post model er fields
    // title ?: string;
    // content ?: string

    searchTerm?: string
    page?: string
    limit?: string
    sortOrder?: string
    sortBy?: string
} 