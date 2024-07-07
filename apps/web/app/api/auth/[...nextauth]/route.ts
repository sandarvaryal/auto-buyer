import NextAuth from "next-auth";
import { NEXT_AUTH } from "@repo/utils/auth";

const handler = NextAuth(NEXT_AUTH);

export { handler as GET, handler as POST };
