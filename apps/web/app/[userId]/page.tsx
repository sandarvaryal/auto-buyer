"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import DarazAccounts from "../components/darazAccounts";
import DarazAccountInstances from "../components/darazAccountInstances";
import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

interface DarazAccountsInterface {
  id: number;
  email: string;
}
interface DarazAccountInstance {
  id: number;
  addedDate: string;
  url: string;
  dropped: boolean;
}

export default function Main({ params }: { params: { userId: string } }) {
  const userId = params.userId;
  const { data: session } = useSession();
  const router = useRouter();

  const [darazAccounts, setDarazAccounts] = useState<DarazAccountsInterface[]>(
    []
  );
  const [darazAccountInstances, setDarazAccountInstances] = useState<
    DarazAccountInstance[]
  >([]);

  useEffect(() => {
    const fetchDarazAccounts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_EXPRESS_SERVER_URL}/darazAccounts`
        );
        setDarazAccounts(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDarazAccounts();
  }, []);

  const accountClicked = async (id: number) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_EXPRESS_SERVER_URL}/darazAccountInstances?accountId=${id}`
      );
      setDarazAccountInstances(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        margin: "3rem",
      }}
    >
      {!session && <>router.push("/")</>}
      {session?.user.id != userId && <>router.push("/")</>}
      <div>
        <button
          onClick={() => {
            router.push(`/${userId}/addDarazAccount`);
          }}
        >
          Add New Account
        </button>
        {!darazAccounts[0] && (
          <div>
            <h1>No daraz accounts</h1>
          </div>
        )}
        {darazAccounts.map((account) => (
          <div
            style={{ cursor: "pointer" }}
            className="account-instances"
            onClick={() => {
              accountClicked(account.id);
            }}
          >
            <DarazAccounts key={account.id} email={account.email} />
          </div>
        ))}
      </div>
      <div>
        <button
          onClick={() => {
            router.push(`/${userId}/addDarazAccountInstance`);
          }}
        >
          Add New Instance
        </button>
        {!darazAccountInstances[0] && (
          <div>
            <h1>No instance for this account</h1>
          </div>
        )}
        {darazAccountInstances.map((instance) => (
          <div>
            <DarazAccountInstances
              key={instance.id}
              addedDate={instance.addedDate}
              url={instance.url}
              dropped={instance.dropped}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
