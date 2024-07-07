"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const formSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_EXPRESS_SERVER_URL}/register`,
        {
          email,
          username,
          password,
        }
      );
      router.push("/register/verify");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>Register to maintain your daraz accounts</h1>
      <form onSubmit={formSubmitHandler}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          placeholder="Username"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
        />
        <button type="submit">Sign Up</button>
      </form>
    </>
  );
}
