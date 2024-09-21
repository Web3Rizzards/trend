import { ExtendedPostType } from "@/lib/sign/types";
import { FC, useEffect, useState } from "react";
import {
  PostThumbsUpButton,
  PostContainer,
  PostContent,
  PostSection,
  PostSubSection,
  PostTimestamp,
} from "./style";
import DangerousAvatar from "../DangerousAvatar";
import { generatePfp } from "@/lib/noun/pfp";
import { useTrend } from "@/hooks/useTrend";
import { useUser } from "@/context/UserContext";
import { decodeAbiParameters, hexToBigInt } from "viem";

interface IProps {
  post: ExtendedPostType;
}

const Post: FC<IProps> = ({ post }) => {
  const { proof, merkle_root, nullifier_hash } = useUser();
  const trendSDK = useTrend();
  const [avatar, setAvatar] = useState<string>("");

  const getPfp = async (address: string) => {
    const svg = await generatePfp(address);
    setAvatar(svg);
  };

  useEffect(() => {
    if (post.from) {
      getPfp(post.from);
    }
  }, [post.from]);

  const handleLike = async () => {
    const unpackedProof = decodeAbiParameters(
      [{ type: "uint256[8]" }],
      proof as `0x${string}`
    )[0];

    try {
      const response = await trendSDK?.reactToPost(
        post.id,
        {
          reactionType: "👍",
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

  return (
    <PostContainer>
      <DangerousAvatar src={avatar} alt="PFP" />
      <PostSection>
        <PostSubSection>
          <PostContent>{post.content}</PostContent>
          <PostThumbsUpButton onClick={handleLike}>👍</PostThumbsUpButton>
        </PostSubSection>
        <PostTimestamp>{post.timestamp}</PostTimestamp>
      </PostSection>
    </PostContainer>
  );
};

export default Post;
