import express from "express";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "@repo/utils/auth";
import { PrismaClient } from "@repo/db/client";
import axios from "axios";

const router = express.Router();
const prisma = new PrismaClient();

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

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      darazAccounts: true,
    },
  });
  const obj = user?.darazAccounts.map((account) => {
    return {
      id: account.id,
      email: account.email,
    };
  });

  return res.status(200).json({ data: obj });
});
export default router;
