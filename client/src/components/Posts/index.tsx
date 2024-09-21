import { useTrend } from "@/hooks/useTrend";
import { useEffect, useState } from "react";
import { PostsContainer } from "./style";
import Post from "../Post";
import { ExtendedPostType } from "@/lib/sign/types";

const Posts = () => {
  const trendSDK = useTrend();
  const [posts, setPosts] = useState<ExtendedPostType[]>([]);

  const fetchData = async () => {
    setPosts((await trendSDK?.getPosts()) ?? []);
  };

  useEffect(() => {
    fetchData();
  }, [trendSDK]);

  return (
    <PostsContainer>
      {posts.length > 0 ? (
        <>
          {posts.map((post: any) => (
            <Post post={post} />
          ))}
        </>
      ) : (
        <p>No Posts Available!</p>
      )}
    </PostsContainer>
  );
};

export default Posts;
