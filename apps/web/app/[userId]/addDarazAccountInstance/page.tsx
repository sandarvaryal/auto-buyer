"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function AddDarazAccountInstance() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [url, setUrl] = useState("");
  const [priceCriteria, setPriceCriteria] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_EXPRESS_SERVER_URL}/addItem`,
        {
          email,
          url,
          priceCriteria,
        }
      );
      if (response.status === 201) {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder="Daraz Account Email"
        />
        <textarea
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="url to the daraz product"
        />
        <input
          type="text"
          value={priceCriteria}
          onChange={(e) => setPriceCriteria(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
