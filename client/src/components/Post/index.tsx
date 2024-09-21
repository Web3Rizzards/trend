import { User } from "@/lib/type";
import { FC } from "react";

interface IProps {
  user: User;
  content: string;
  likes: number;
  createdDate: string;
}

const Post: FC<IProps> = ({ user, content, likes, createdDate }) => {
  return <div></div>;
};

export default Post;
