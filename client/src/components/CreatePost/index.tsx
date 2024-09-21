import { useEffect, useState } from "react";
import { CreatePostContainer, CreatePostContent } from "./style";
import Button from "../Shared/Button";
import { useTrend } from "@/hooks/useTrend";
import { generatePfp } from "@/lib/noun/pfp";
import DangerousAvatar from "../DangerousAvatar";
import { useAccount } from "wagmi";
import { hexToBigInt, decodeAbiParameters } from "viem";
import { useUser } from "@/context/UserContext";
import Textarea from "../Shared/Textarea";
import { baseSepolia } from "viem/chains";
import AttestationButton from "../AttestationButton";

const CreatePost = () => {
  const { proof, merkle_root, nullifier_hash } = useUser();
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const trendSDK = useTrend();
  const [avatar, setAvatar] = useState<string>("");
  const { address, chainId } = useAccount();

  const handleSubmit = async () => {
    const unpackedProof = decodeAbiParameters(
      [{ type: "uint256[8]" }],
      proof as `0x${string}`
    )[0];

    try {
      const response = await trendSDK?.writePost(
        {
          content,
          image,
        },
        {
          root: hexToBigInt(merkle_root as `0x${string}`),
          proof: unpackedProof as any,
          nullifierHash: hexToBigInt(nullifier_hash as `0x${string}`),
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getPfp = async (address: string) => {
    const svg = await generatePfp(address);
    setAvatar(svg);
  };

  useEffect(() => {
    if (address) {
      getPfp(address);
    }
  }, [address]);

  return (
    <CreatePostContainer>
      <DangerousAvatar src={avatar} alt="PFP" />
      <CreatePostContent>
        <Textarea id={"post-content"} setContent={setContent} value={content} />
        {chainId === baseSepolia.id ? (
          <Button label="Post" onClick={handleSubmit} />
        ) : (
          <AttestationButton />
        )}
      </CreatePostContent>
    </CreatePostContainer>
  );
};

export default CreatePost;
