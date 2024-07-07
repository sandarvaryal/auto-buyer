"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();

  const router = useRouter();
  useEffect(() => {
    if (session) {
      router.push(`/${session.user?.id}`);
    }
    console.log(session);
  }, [session, router]);
  return (
    <>
      {!session ? (
        <>
          <h1>Login to the application pz </h1>
        </>
      ) : (
        router.push(`/${session.user?.id}`)
      )}
    </>
  );
}
