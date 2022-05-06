import type { KudoStyle, Prisma } from "./prisma.server";
import { prisma } from "./prisma.server";

export const createKudo = async (
  message: string,
  userId: string,
  recipientId: string,
  style: KudoStyle
) => {
  return prisma.kudo.create({
    data: {
      message,
      author: {
        connect: {
          id: userId,
        },
      },
      recipient: {
        connect: {
          id: recipientId,
        },
      },
      style,
    },
  });
};

export const getFilteredKudos = async (
  userId: string,
  sortFilter: Prisma.KudoOrderByWithRelationInput,
  whereFilter: Prisma.KudoWhereInput
) => {
  return prisma.kudo.findMany({
    take: 3,
    where: {
      authorId: userId,
      ...whereFilter,
    },
    orderBy: sortFilter,
    select: {
      id: true,
      style: true,
      message: true,
      author: {
        select: { profile: true },
      },
    },
  });
};

export const getRecentKudos = async () => {
  return prisma.kudo.findMany({
    take: 3,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      style: {
        select: { emoji: true },
      },
      recipient: {
        select: { id: true, profile: true },
      },
    },
  });
};
