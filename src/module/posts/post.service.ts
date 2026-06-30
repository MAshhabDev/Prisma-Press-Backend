import { PostStatus, Status } from "../../../generated/prisma/enums";
import type { postWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import type {
  ICreatePostPayload,
  IPayload,
  IPostQuery,
} from "./post.interface";

const getAllPosts = async (query: IPostQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "created_at";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";

  const tags = query.tags ? JSON.parse(query.tags as string) : null;
  const tagsArray = Array.isArray(tags) ? tags : [];

  const andCondition: postWhereInput[] = [];

  if (query.searchTerm) {
    andCondition.push({
      OR: [
        {
          title: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
          content: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (query.title) {
    andCondition.push({
      title: query.title,
    });
  }
  if (query.content) {
    andCondition.push({
      content: query.content,
    });
  }
  if (query.tags) {
    andCondition.push({
      tags: {
        hasSome: tagsArray,
      },
    });
  }

   

  const result = await prisma.post.findMany({
    where: {
      AND: andCondition,
    },

    // dynamic pagination and sorting

    take: limit,
    skip: skip,

    orderBy: {
      // sortBy : sortOrder
      [sortBy]: sortOrder,
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

const getPostStats = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    // const totalPosts = await tx.post.count();

    // const totalPublishedPosts = await tx.post.count({
    //   where: {
    //     status: PostStatus.PUBLISHED,
    //   },
    // });
    // const totalArchivedPosts = await tx.post.count({
    //   where: {
    //     status: PostStatus.ARCHIVED,
    //   },
    // });
    // const totalDraftPosts = await tx.post.count({
    //   where: {
    //     status: PostStatus.DRAFT,
    //   },
    // });
    // const totalApprovedComments = await tx.comment.count({
    //   where: {
    //     status: Status.APPROVED,
    //   },
    // });
    // const totalRejectedComments = await tx.comment.count({
    //   where: {
    //     status: Status.REJECT,
    //   },
    // });

    // const totalViewsAggregate = await tx.post.aggregate({
    //   _sum: {
    //     views: true,
    //   },
    // });
    // const totalViews = totalViewsAggregate._sum.views;

    const [
      totalPosts,
      totalPublishedPosts,
      totalArchivedPosts,
      totalDraftPosts,
      totalApprovedComments,
      totalRejectedComments,
      totalViewsAggregate,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.ARCHIVED,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.DRAFT,
        },
      }),
      await tx.comment.count({
        where: {
          status: Status.APPROVED,
        },
      }),
      await tx.comment.count({
        where: {
          status: Status.REJECT,
        },
      }),

      await tx.post.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);

    return {
      totalPosts,
      totalPublishedPosts,
      totalArchivedPosts,
      totalDraftPosts,
      totalApprovedComments,
      totalRejectedComments,
      totalViews: totalViewsAggregate._sum.views,
    };
  });

  return transactionResult;
};

const getPostById = async (userId: string) => {
  // const result = await prisma.post.findUniqueOrThrow({
  //   where: {
  //     id: userId,
  //   },
  // });

  // const updatePost = await prisma.post.update({
  //   where: {
  //     id: userId,
  //   },
  //   data: {
  //     views: {
  //       increment: 1,
  //     },
  //   },
  //   include: {
  //     author: {
  //       omit: {
  //         password: true,
  //       },
  //     },
  //     comment: true,
  //   },
  // });

  const transactionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: userId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    const post = await tx.post.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },

        comments: {
          where: {
            status: Status.APPROVED,
          },

          orderBy: {
            createdAt: "desc",
          },
        },

        _count: {
          select: {
            comment: true,
          },
        },
      },
    });

    return post;
  });
  return transactionResult;
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

const deletePost = async (
  postId: string,
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

  const result = await prisma.post.delete({
    where: {
      id: postId,
    },
  });

  return result;
};

export const postService = {
  getAllPosts,
  getMyPosts,
  getPostById,
  getPostStats,
  createPost,
  updatePost,
  deletePost,
};
