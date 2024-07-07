import express from "express";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "@repo/utils/auth";
import { PrismaClient } from "@repo/db/client";
import axios from "axios";
import { z } from "zod";

const router = express.Router();
const prisma = new PrismaClient();

const queryObjSchema = z.object({
  accountId: z.number(),
});

router.get("/", async (req, res) => {
  // const session = await getServerSession(req, res, NEXT_AUTH);
  // if (!session) {
  //   return res.status(401).json({ message: "request unauthorized" });
  // }

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

  if (!req.query.accountId) {
    return res.status(400).json({ message: "accountId is required" });
  }

  const queryNumberType =
    typeof req.query.accountId === "string"
      ? parseInt(req.query.accountId, 10)
      : req.query.accountId;

  const parsedInput = queryObjSchema.safeParse({ accountId: queryNumberType });
  if (!parsedInput.success) {
    return res.status(400).json({ message: "failed to parse input" });
  }
  const { accountId } = parsedInput.data;

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      darazAccounts: {
        include: {
          instances: true,
        },
      },
    },
  });
  console.log(user);
  const find = user?.darazAccounts.find((account) => account.id === accountId);
  if (!find) {
    return res
      .status(404)
      .json({ message: "no darazAccount matches the given id" });
  }

  const obj = find?.instances.map((instance) => {
    return {
      id: instance.id,
      addedDate: instance.addedDate,
      url: instance.url,
      dropped: instance.progress,
    };
  });

  return res.status(200).json({ data: obj });
});

export default router;
