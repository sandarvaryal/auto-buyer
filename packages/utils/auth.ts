import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import axios from "axios";

const formInputSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const NEXT_AUTH = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email", placeholder: "Email" },
        password: {
          label: "password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials: any) {
        const parsedInput = formInputSchema.safeParse(credentials);
        if (!parsedInput.success) {
          return null;
        }

        const { email, password } = parsedInput.data;
        const payload = { email, password };
        console.log(payload);

        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_EXPRESS_SERVER_URL}/login`,
            payload
          );
          if (response.status != 200) {
            return null;
          }
          return {
            id: response.data.id,
            email: response.data.email,
            name: response.data.name,
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  // cookies: {
  //   sessionToken: {
  //     name: `next-auth.session-token`,
  //     options: {
  //       httpOnly: true,
  //       sameSite: "None",
  //       secure: true,
  //     },
  //   },
  // },
  callbacks: {
    jwt: async ({ user, token }: any) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
    session: async ({ session, token, user }: any) => {
      console.log("triggered");
      if (session.user) {
        session.user.id = token.uid;
      }
      console.log("problem?????????????????????");
      console.log(session);
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  config: {
    api: {
      bodyParser: false,
    },
  },
};
