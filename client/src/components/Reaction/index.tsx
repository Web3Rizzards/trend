import { useState } from "react";
import Avatar from "../Avatar";
import { CreatePostContainer, CreatePostContent } from "./style";
import Button from "../Shared/Button";

import { useAccount } from "wagmi";
import { useTrend } from "@/hooks/useTrend";

const CreateAccount = () => {
  const [postId, setPostId] = useState<string>("");

  const trendSDK = useTrend();

  const handleSubmit = async () => {
    await trendSDK?.reactToPost(
      postId,
      {
        reactionType: "👍",
      },
      proof
    ); // TODO: @mongchanghsi get proof
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
