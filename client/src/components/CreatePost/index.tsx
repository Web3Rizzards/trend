import { useState } from "react";
import Avatar from "../Avatar";
import Textarea from "../Shared/Textarea";
import { CreatePostContainer, CreatePostContent } from "./style";
import Button from "../Shared/Button";

const CreatePost = () => {
  const [content, setContent] = useState<string>("");

  const handleChange = (_content: string) => {
    setContent(_content);
  };

  const handleSubmit = () => {
    console.log("Submit");
  };

  return (
    <CreatePostContainer>
      <Avatar src={""} alt="PFP" />
      <CreatePostContent>
        <Textarea value={content} setContent={handleChange} id={"Content"} />
        <Button label="Create Post" onClick={handleSubmit} />
      </CreatePostContent>
    </CreatePostContainer>
  );
};

export default CreatePost;
