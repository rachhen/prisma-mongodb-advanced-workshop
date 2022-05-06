import bcrypt from "bcryptjs";
import { prisma } from "./prisma.server";
import type { RegisterForm } from "./types.server";
import type { Profile } from "./prisma.server";

export const createUser = async (user: RegisterForm) => {
  const passwordHash = await bcrypt.hash(user.password, 10);

  const newUser = await prisma.user.create({
    select: { id: true, email: true },
    data: {
      email: user.email,
      password: passwordHash,
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
    },
  });

  return {
    id: newUser.id,
    email: newUser.email,
  };
};

export const getOtherUsers = async (userId: string) => {
  return prisma.user.findMany({
    select: { id: true, email: true, profile: true },
    where: { id: { not: userId } },
    orderBy: {
      profile: {
        firstName: "asc",
      },
    },
  });
};

export const getUserById = async (userId: string) => {
  return prisma.user.findUnique({
    select: { id: true, email: true, profile: true },
    where: { id: userId },
  });
};

export const updateUser = async (userId: string, profile: Profile) => {
  await prisma.user.update({
    where: { id: userId },
    data: {
      profile: {
        update: profile,
      },
    },
  });
};

export const deleteUser = async (id: string) => {
  await prisma.user.delete({ where: { id } });
};
