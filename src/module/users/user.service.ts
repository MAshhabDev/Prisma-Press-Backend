import { config } from "../../config";
import { prisma } from "../../lib/prisma";

import bcrypt from "bcrypt";

const createUserInToDb = async (payload: any) => {
  const { name, email, password, profile } = payload;
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

  return user;
};

export const userService = {
  createUserInToDb,
};
