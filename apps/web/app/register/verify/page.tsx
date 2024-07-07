"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function VerifyComponent() {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState("");
  const submitVerificationCode = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_EXPRESS_SERVER_URL}/register/verify`,
        {
          verificationCode,
        }
      );
      if (response.status === 201) {
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form onSubmit={submitVerificationCode}>
        <input
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          type="text"
          placeholder="Verification Code"
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
