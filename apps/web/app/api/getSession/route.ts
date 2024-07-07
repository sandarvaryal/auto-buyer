import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "@repo/utils/auth";

export async function GET() {
  const session = await getServerSession(NEXT_AUTH);
  if (session) {
    return Response.json(session);
  } else {
    return Response.json({ message: "unauthorized" });
  }
}
