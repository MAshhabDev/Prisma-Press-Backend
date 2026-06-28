import { prisma } from "../../lib/prisma";
import type { ICreatePostPayload, IPayload } from "./post.interface";

const getAllPosts = async () => {
  const result = await prisma.post.findMany({
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comment: true,
    },
  });

  return result;
};

const getMyPosts = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId,
    },

    orderBy: {
      create_at: "desc",
    },
    include: {
      comment: true,
      author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: {
          comment: true,
        },
      },
    },
  });

  return result;
};

const getPostStats = async () => {};

const getPostById = async (userId: string) => {
  const result = await prisma.post.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  const updatePost = await prisma.post.update({
    where: {
      id: userId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comment: true,
    },
  });

  return updatePost;
};

const createPost = async (payload: ICreatePostPayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};

const updatePost = async (
  postId: string,
  payload: IPayload,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not the owner of this post");
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,

    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comment: true,
    },
  });

  return result;
};

const deletePost = async () => {};

export const postService = {
  getAllPosts,
  getMyPosts,
  getPostById,
  getPostStats,
  createPost,
  updatePost,
  deletePost,
};
