import { useState } from "react";
import Avatar from "../Avatar";
import { CreatePostContainer, CreatePostContent } from "./style";
import Button from "../Shared/Button";
import { hexToBigInt, decodeAbiParameters } from "viem";
import { useTrend } from "@/hooks/useTrend";
import { useAccount } from "wagmi";
import { useUser } from "@/context/UserContext";

const CreateAccount = () => {
  const { proof, merkle_root, nullifier_hash } = useUser();
  const [name, setName] = useState<string>("");
  const [preferredUsername, setPreferredUsername] = useState<string>("");
  const { address } = useAccount();

  const trendSDK = useTrend();

  const handleSubmit = async () => {
    const unpackedProof = decodeAbiParameters(
      [{ type: "uint256[8]" }],
      proof as `0x${string}`
    )[0];

    try {
      const response = await trendSDK?.createUserProfile(
        {
          name,
          preferredUsername,
        },
        {
          root: hexToBigInt(merkle_root as `0x${string}`),
          proof: unpackedProof as any,
          nullifierHash: hexToBigInt(nullifier_hash as `0x${string}`),
        }
      );
      console.log("Submit");
    } catch (error) {}
  };

  return (
    <CreatePostContainer>
      <Avatar src={""} alt="PFP" />
      <CreatePostContent>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <input
          type="text"
          value={preferredUsername}
          onChange={(e) => setPreferredUsername(e.target.value)}
          placeholder="Enter your preferred username"
        />
        <Button label="Create Account" onClick={handleSubmit} />
      </CreatePostContent>
    </CreatePostContainer>
  );
};

export default CreateAccount;
