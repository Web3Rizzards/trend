import { useState } from "react";
import Avatar from "../Avatar";
import Textarea from "../Shared/Textarea";
import { CreatePostContainer, CreatePostContent } from "./style";
import Button from "../Shared/Button";
import { TrendSDK } from "../../lib/sign";
import { createWalletClient, custom } from "viem";
import { baseSepolia } from "viem/chains";
import { useAccount } from "wagmi";
import { useTrend } from "@/hooks/useTrend";

const CreateAccount = () => {
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [preferredUsername, setPreferredUsername] = useState<string>("");
  const { address, isConnected, chain } = useAccount();
  const trendSDK = useTrend();

  const handleSubmit = async () => {
    console.log(address);
    const client = createWalletClient({
      chain: baseSepolia,
      transport: custom(window.ethereum!),
    });

    await trendSDK?.writePost(
      {
        content,
        image,
      },
      proof
    ); // TODO: @mongchanghsi get proof
    console.log("Submit");
  };

  return (
    <CreatePostContainer>
      <Avatar src={""} alt="PFP" />
      <CreatePostContent>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your content"
        />
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Enter your image"
        />
        <Button label="Post" onClick={handleSubmit} />
      </CreatePostContent>
    </CreatePostContainer>
  );
};

export default CreateAccount;
