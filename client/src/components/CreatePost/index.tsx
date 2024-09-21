import { useEffect, useState } from "react";
import { CreatePostContainer, CreatePostContent } from "./style";
import Button from "../Shared/Button";
import { useTrend } from "@/hooks/useTrend";
import { generatePfp } from "@/lib/noun/pfp";
import DangerousAvatar from "../DangerousAvatar";
import { useAccount } from "wagmi";

const CreateAccount = () => {
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const trendSDK = useTrend();
  const [avatar, setAvatar] = useState<string>("");
  const { address } = useAccount();

  const handleSubmit = async () => {
    // TODO: @mongchanghsi get proof
    // await trendSDK?.writePost(
    //   {
    //     content,
    //     image,
    //   },
    //   proof
    // );
    console.log("Submit");
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
