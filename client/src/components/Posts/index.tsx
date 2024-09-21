import { useTrend } from "@/hooks/useTrend";
import { useEffect, useState } from "react";
import { PostsContainer } from "./style";
import Post from "../Post";
import { ExtendedPostType } from "@/lib/sign/types";
import CreatePost from "../CreatePost";

const Posts = () => {
  const trendSDK = useTrend();
  const [posts, setPosts] = useState<ExtendedPostType[]>([]);

  const fetchData = async () => {
    setPosts((await trendSDK?.getPosts()) ?? []);
  };

  useEffect(() => {
    fetchData();
  }, [trendSDK]);

  const handleNewPost = (
    address: `0x${string}`,
    content: string,
    timestamp: string
  ) => {
    setPosts((prevPosts) => [
      {
        content,
        image: "",
        timestamp,
        from: address,
        id: "XXX",
      },
      ...prevPosts,
    ]);
  };

  return (
    <PostsContainer>
      <CreatePost callback={handleNewPost} />
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
