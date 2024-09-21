import { ExtendedPostType } from "@/lib/sign/types";
import { FC, useEffect, useState } from "react";
import {
  PostContainer,
  PostContent,
  PostSection,
  PostTimestamp,
  PostReactTab,
  PostReactTabs,
} from "./style";
import DangerousAvatar from "../DangerousAvatar";
import { generatePfp } from "@/lib/noun/pfp";
import { useTrend } from "@/hooks/useTrend";
import { useUser } from "@/context/UserContext";
import { decodeAbiParameters, hexToBigInt } from "viem";

const REACTION_OPTIONS = ["👍", "🔥", "💕", "💪"];

interface IProps {
  post: ExtendedPostType;
}

const Post: FC<IProps> = ({ post }) => {
  const { proof, merkle_root, nullifier_hash } = useUser();
  const trendSDK = useTrend();
  const [avatar, setAvatar] = useState<string>("");
  const [reactionCounter, setReactionCounter] = useState<any>({
    "👍": 0,
    "🔥": 0,
    "💕": 0,
    "💪": 0,
  });

  const getPfp = async (address: string) => {
    const svg = await generatePfp(address);
    setAvatar(svg);
  };

  useEffect(() => {
    if (post.from) {
      getPfp(post.from);
    }
  }, [post.from]);

  useEffect(() => {
    fetchReactions();
  }, [trendSDK]);

  const handleReact = async (react: string) => {
    const unpackedProof = decodeAbiParameters(
      [{ type: "uint256[8]" }],
      proof as `0x${string}`
    )[0];

    try {
      const response = await trendSDK?.reactToPost(
        post.id,
        {
          reactionType: react,
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

  const fetchReactions = async () => {
    try {
      const response = await trendSDK?.getReactsForPost(post.id);
      let counter: { [key: string]: number } = {
        "👍": 0,
        "🔥": 0,
        "💕": 0,
        "💪": 0,
      };
      response?.forEach((res) => {
        if (REACTION_OPTIONS.includes(res.reactionType)) {
          counter[res.reactionType] += 1;
        }
      });
      setReactionCounter(counter);
    } catch (error) {}
  };

  return (
    <PostContainer>
      <DangerousAvatar src={avatar} alt="PFP" />
      <PostSection>
        <PostContent>{post.content}</PostContent>
        <PostReactTabs>
          {REACTION_OPTIONS.map((_type) => (
            <PostReactTab
              id={`${post.id}_${_type}`}
              onClick={() => handleReact(_type)}
            >
              {_type} {reactionCounter[_type]}
            </PostReactTab>
          ))}
        </PostReactTabs>
        <PostTimestamp>{post.timestamp}</PostTimestamp>
      </PostSection>
    </PostContainer>
  );
};

export default Post;
