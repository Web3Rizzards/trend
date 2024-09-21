import { useState } from "react";
import Avatar from "../Avatar";
import { CreatePostContainer, CreatePostContent } from "./style";
import Button from "../Shared/Button";

import { useTrend } from "@/hooks/useTrend";

const CreateAccount = () => {
  const [name, setName] = useState<string>("");
  const [preferredUsername, setPreferredUsername] = useState<string>("");

  const trendSDK = useTrend();

  const handleSubmit = async () => {
    await trendSDK?.createUserProfile(
      {
        name,
        preferredUsername,
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
