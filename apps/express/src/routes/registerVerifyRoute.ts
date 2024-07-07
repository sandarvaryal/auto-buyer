import express from "express";
import { PrismaClient } from "@repo/db/client";
import { z } from "zod";

const router = express.Router();
const prisma = new PrismaClient();

const inputVerifyObj = z.object({
  verificationCode: z.string(),
});

router.post("/", async (req, res) => {
  const parsedInput = inputVerifyObj.safeParse(req.body);
  if (!parsedInput.success) {
    return res.status(400).json({ message: "failed to parse input" });
  }

  const { verificationCode } = parsedInput.data;

  const toBeObj = await prisma.toBeVerified.findUnique({
    where: {
      verificationCode,
    },
  });

  if (!toBeObj) {
    return res.status(404).json({
      message: "please go to registration page to get verification code",
    });
  }

  // const expireDate = toBeObj.verificationCodeExpireDate ?? new Date(0);

  // if (expireDate < new Date()) {
  if (toBeObj.verificationCodeExpireDate < new Date()) {
    // await prisma.toBeVerified.delete({
    //   where: { verificationCode },
    // });
    return res
      .status(400)
      .json({ message: "The verification code has expired" });
  }

  await prisma.user.create({
    data: {
      name: toBeObj.name,
      password: toBeObj.password,
      email: toBeObj.email,
    },
  });

  await prisma.toBeVerified.delete({
    where: { verificationCode },
  });
  return res.status(201).json({ message: "verified" });
});

export default router;
