import express from "express";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "@repo/utils/auth";
import { PrismaClient } from "@repo/db/client";
import { loginAndNotify } from "../utils/puppeteer-check";
import bcrypt from "bcrypt";
import axios from "axios";

const router = express.Router();
const prisma = new PrismaClient();

const requestObj = z.object({
  email: z.string(),
  password: z.string(),
});

router.post("/", async (req, res) => {
  const parsedInput = requestObj.safeParse(req.body);
  if (!parsedInput.success) {
    return res.status(400).json({ message: "failed to parse input" });
  }

  try {
    // const session = await getServerSession(req, res, NEXT_AUTH);
    // if (!session) {
    //   return res.status(401).json({ message: "request unauthorized" });
    // }
    console.log(req.headers.cookie);
    const { data: response } = await axios.get(`${process.env.NEXT_API_URL}`, {
      headers: {
        Cookie: req.headers.cookie,
      },
    });
    if (!response.user) {
      console.log(response);
      return res.status(401).json({ message: "request unauthorized" });
    }
    const session = response;
    console.log(session);

    const { email, password } = parsedInput.data;

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        darazAccounts: true,
      },
    });
    if (user) {
      const specificDarazAccount = user.darazAccounts.find((account) => {
        account.email === email;
      });
      if (specificDarazAccount) {
        return res
          .status(401)
          .json({ message: "daraz account already present for this account" });
      }

      //checjing if the credentials are valid daraz credentials
      console.log({ email, password });
      const isVerified = await loginAndNotify(email, password);
      if (isVerified === "credentials verified") {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.darazAccount.create({
          data: {
            email,
            password: hashedPassword,
            userId: session.user.id,
          },
        });
      } else {
        return res.status(401).json({
          message:
            "incorrect credentials, the credentials doesn't match any daraz account",
        });
      }

      return res
        .status(201)
        .json({ message: "daraz account successfully added" });
    } else {
      return res.status(401).json({ message: "request unauthorized" });
    }
  } catch (error) {
    console.error("error fetching session", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
