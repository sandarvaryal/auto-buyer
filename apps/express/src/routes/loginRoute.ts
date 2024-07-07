import express from "express";
import { PrismaClient } from "@repo/db/client";
import { z } from "zod";
import bcrypt from "bcrypt";

const router = express.Router();
const prisma = new PrismaClient();

const requestObj = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post("/", async (req, res) => {
  const parsedInput = requestObj.safeParse(req.body);
  if (!parsedInput.success) {
    res.status(400).json({ message: "failed to parse input" });
    return null;
  }

  const { email, password } = parsedInput.data;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const passwordValidation = await bcrypt.compare(password, user.password);
  if (!passwordValidation) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  return res.status(200).json({
    id: user.id,
    email: user.email,
    name: user.name,
  });
});

export default router;
