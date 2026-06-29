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

export const commentService = {
  createComments,
};
