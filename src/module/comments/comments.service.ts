import { prisma } from "../../lib/prisma";
import type { ICreateCommentPayload } from "./comments.interface";

const createComments = async (
  authorId: string,
  payload: ICreateCommentPayload,
) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  const result = await prisma.comment.create({
    data: {
      ...payload,
      authorId,
    },
  });

  return result;
};

const getCommentByAuthorId = async (authorId: string) => {
  const result = await prisma.comment.findMany({
    where: {
      id: authorId,
    },

    orderBy: {
      create_at: "desc",
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return result;
};

const getCommentByCommentId = async (postId: string) => {
  const result = await prisma.comment.findMany({
    where: {
      id: postId,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return result;
};

export const commentService = {
  createComments,
  getCommentByAuthorId,
  getCommentByCommentId
};
