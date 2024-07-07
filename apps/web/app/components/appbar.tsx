"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export const Appbar = () => {
  const { data: session } = useSession();

  const router = useRouter();
  return (
    <>
      {!session ? (
        <>
          <button
            onClick={() => {
              router.push("./login");
            }}
          >
            Login
          </button>
          <button
            onClick={() => {
              router.push("./register");
            }}
          >
            Register
          </button>
        </>
      ) : (
        <button onClick={() => signOut()}>Logout</button>
      )}
    </>
  );
};
