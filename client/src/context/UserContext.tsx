import userDb from "@/lib/database/User";
import React, { useEffect, useState } from "react";
import { PropsWithChildren } from "react";
import { useAccount } from "wagmi";

type State = {
  proof: string;
  merkle_root: string;
  nullifier_hash: string;
  verified: boolean;
};

const initialState: State = {
  proof: "",
  merkle_root: "",
  nullifier_hash: "",
  verified: false,
};

const UserContext = React.createContext<State>(initialState);

const UserProvider = ({ children }: PropsWithChildren) => {
  const { address } = useAccount();
  const [proof, setProof] = useState<string>("");
  const [root, setRoot] = useState<string>("");
  const [hash, setHash] = useState<string>("");
  const [verified, setVerified] = useState<boolean>(false);

  const fetchData = async (address: `0x${string}`) => {
    const data = await userDb.getUser(address);
    if (data) {
      setProof(data.proof);
      setRoot(data.merkle_root);
      setHash(data.nullifier_hash);
      setVerified(data.verified);
    }
  };

  useEffect(() => {
    if (address) {
      fetchData(address);
    }
  }, [address]);

  return (
    <UserContext.Provider
      value={{ proof, merkle_root: root, nullifier_hash: hash, verified }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser do not have context");
  }
  return context;
};

export { UserProvider, useUser };
