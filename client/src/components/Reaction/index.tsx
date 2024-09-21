import { useState } from "react";
import Avatar from "../Avatar";
import { CreatePostContainer, CreatePostContent } from "./style";
import Button from "../Shared/Button";
import { createWalletClient, custom } from "viem";
import { baseSepolia } from "viem/chains";
import { useAccount } from "wagmi";
import { useTrend } from "@/hooks/useTrend";

const CreateAccount = () => {
  const [postId, setPostId] = useState<string>("");
  const { address, isConnected, chain } = useAccount();

  const trendSDK = useTrend();

  const handleSubmit = async () => {
    console.log(address);
    const client = createWalletClient({
      chain: baseSepolia,
      transport: custom(window.ethereum!),
    });

    await trendSDK?.reactToPost(postId, {
      reactionType: "👍",
    });
    console.log("Submit");
  };

  return (
    <CreatePostContainer>
      <Avatar src={""} alt="PFP" />
      <CreatePostContent>
        <input
          type="text"
          value={postId}
          onChange={(e) => setPostId(e.target.value)}
          placeholder="Enter your post id (0x838)"
        />
        <Button label="React" onClick={handleSubmit} />
      </CreatePostContent>
    </CreatePostContainer>
  );
};

export default CreateAccount;
