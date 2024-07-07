import express from "express";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "@repo/utils/auth";
import { z } from "zod";
import { PrismaClient } from "@repo/db/client";
import { checkPriceAndAddToCart } from "../utils/puppeteer-main";
import { sendEmailPricesDropNotifier } from "../utils/emailPricesDropNotifier";
import axios from "axios";

const router = express.Router();
const prisma = new PrismaClient();

const inputVerifyObj = z.object({
  email: z.string(),
  url: z.string(),
  priceCriteria: z.number().max(100000),
});

router.post("/", async (req, res) => {
  const priceCriteriaInt =
    typeof req.body.priceCriteria === "string"
      ? parseInt(req.body.priceCriteria, 10)
      : req.body.priceCriteria;

  const parsedInput = inputVerifyObj.safeParse({
    email: req.body.email,
    url: req.body.url,
    priceCriteria: priceCriteriaInt,
  });
  if (!parsedInput.success) {
    return res.status(400).json({ message: "failed to parse input" });
  }

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

  const { email, url, priceCriteria } = parsedInput.data;

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      darazAccounts: true,
    },
  });
  if (user) {
    console.log(email);
    console.log(user);
    const specificDarazAccount = user.darazAccounts.find((account) => {
      return account.email === email;
    });
    console.log(specificDarazAccount);
    if (!specificDarazAccount) {
      return res.status(401).json({
        message: "this account doesnt have the requested daraz account",
      });
    }
    //fix
    const obj = await prisma.darazInstance.create({
      data: {
        addedDate: new Date(),
        progress: false,
        url: url,
        darazAccountId: specificDarazAccount.id,
      },
    });

    const loopFunction = async () => {
      const checkObj = await prisma.darazInstance.findUnique({
        where: {
          id: obj.id,
        },
      });
      if (!checkObj?.progress) {
        try {
          const hasDropped = await checkPriceAndAddToCart(
            email,
            url,
            priceCriteria
          );
          if (hasDropped) {
            clearInterval(intervalId);
            await sendEmailPricesDropNotifier(session.user.email, url);
            await prisma.darazInstance.update({
              where: {
                id: obj.id,
              },
              data: {
                progress: true,
              },
            });
          }
        } catch (error) {
          console.error("error when checking price: ", error);
        }
      }
      clearInterval(intervalId);
      await sendEmailPricesDropNotifier(session.user.email, url);
      console.log("prices dropped");
      return res.status(201).json({ message: "the prices dropped" });
    };

    loopFunction();
    const intervalId = setInterval(loopFunction, 10 * 60 * 1000);

    //to fix here
  } else {
    return res.status(401).json({ message: "request unautohorized" });
  }
});

export default router;
