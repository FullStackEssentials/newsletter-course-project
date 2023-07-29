import { PrismaClient } from "@prisma/client";
import { createRandomToken } from "../utils/random";
import { ErrorCode } from "../errors/api-error";

export const upsertSubscriber = async (prisma: PrismaClient, email: string) => {
  try {
    const newsletterSubscriber = await prisma.newsletterSubscriber.upsert({
      create: {
        email,
        active: false,
        confirmed: false,
        token: createRandomToken(),
      },
      update: {
        active: false,
        confirmed: false,
        token: createRandomToken(),
      },
      where: {
        email,
      },
    });

    return newsletterSubscriber;
  } catch (error) {
    throw new Error();
  }
};

export const confirmSubscriber = async (
  prisma: PrismaClient,
  email: string,
  token: string
) => {
  const newsletterSubscriber = await prisma.newsletterSubscriber.findFirst({
    where: {
      email,
      token,
    },
  });

  if (!newsletterSubscriber) {
    throw new ErrorCode("ERR-001", "token");
  }

  const updatedSubscriber = await prisma.newsletterSubscriber.update({
    where: {
      email,
    },
    data: {
      confirmed: true,
      token: "",
    },
  });

  return updatedSubscriber;
};