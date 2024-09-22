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
import toast from "react-hot-toast";

const REACTION_OPTIONS = ["👍", "🔥", "💕", "💪"];

interface IProps {
  isNew: boolean;
  post: ExtendedPostType;
}

const Post: FC<IProps> = ({ post, isNew }) => {
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

      const currentReactCounter = { ...reactionCounter };
      currentReactCounter[react] += 1;
      setReactionCounter(currentReactCounter);
    } catch (error) {
      console.log(error);
    }
    toast.success("Reacted!");
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

  const formatDate = (timestamp: number): string => {
    const _date = new Date(timestamp);

    const day = String(_date.getDate()).padStart(2, "0");
    const month = String(_date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = _date.getFullYear();

    let hours: any = _date.getHours();
    const minutes = String(_date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12; // Convert to 12-hour format
    hours = hours ? String(hours).padStart(2, "0") : "12"; // '0' should be '12'

    return `${day}/${month}/${year} ${hours}:${minutes}${ampm}`;
  };
  return (
    <PostContainer className={isNew ? "new" : ""}>
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
        <PostTimestamp>{formatDate(+post.timestamp)}</PostTimestamp>
      </PostSection>
    </PostContainer>
  );
};

export default Post;
