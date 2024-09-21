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
  const [content, setContent] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [preferredUsername, setPreferredUsername] = useState<string>("");
  const { address, isConnected, chain } = useAccount();

  const handleChange = (_content: string) => {
    setContent(_content);
  };

  const handleSubmit = async () => {
    console.log(address);
    const client = createWalletClient({
      chain: baseSepolia,
      transport: custom(window.ethereum!),
    });

    let trendClient = new TrendSDK(undefined, client);
    await trendClient.createUserProfile({
      name,
      preferredUsername,
    });
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
