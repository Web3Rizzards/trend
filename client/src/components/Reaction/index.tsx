import { useState } from "react";
import Avatar from "../Avatar";
import Textarea from "../Shared/Textarea";
import { CreatePostContainer, CreatePostContent } from "./style";
import Button from "../Shared/Button";
import { TrendSDK } from "../../lib/sign";
import { createWalletClient, custom } from "viem";
import { baseSepolia } from "viem/chains";
import { useAccount } from "wagmi";

const CreateAccount = () => {
  const [postId, setPostId] = useState<string>("");
  const { address, isConnected, chain } = useAccount();

  const handleSubmit = async () => {
    console.log(address);
    const client = createWalletClient({
      chain: baseSepolia,
      transport: custom(window.ethereum!),
    });

    let trendClient = new TrendSDK(undefined, client);
    await trendClient.reactToPost(postId, {
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
