import express from "express";
import { PrismaClient } from "@repo/db/client";
import bcrypt from "bcrypt";
import { z } from "zod";
import { sendEmailVerificationCode } from "../utils/emailVerificationSender";
import { v4 as uuidv4 } from "uuid";

import registerVerifyRoute from "./registerVerifyRoute";

const router = express.Router();
const prisma = new PrismaClient();

const bodyInputProps = z.object({
  email: z.string(),
  username: z.string(),
  password: z.string(),
});

router.post("/", async (req, res) => {
  const parsedInput = bodyInputProps.safeParse(req.body);
  if (!parsedInput.success) {
    return res.status(400).json({ error: "failed to parse input" });
  }

  const { email, username, password } = parsedInput.data;

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    return res.status(411).json({
      error: "Email already in use",
    });
  }

  const verificationCode = uuidv4();
  const verificationCodeExpireDate = new Date();
  verificationCodeExpireDate.setMinutes(
    verificationCodeExpireDate.getMinutes() + 5
  );

  const emailSent = await sendEmailVerificationCode(email, verificationCode);

  const hashedPassword = await bcrypt.hash(password, 10);
  if (emailSent) {
    await prisma.toBeVerified.create({
      data: {
        email: email,
        verificationCode,
        verificationCodeExpireDate,
        name: username,
        password: hashedPassword,
      },
    });

    res.status(200).json({ message: "email sent successfully" });
  } else {
    res
      .status(500)
      .json({ message: "Failed to send email , please try again later" });
  }
});

router.use("/verify", registerVerifyRoute);

export default router;
