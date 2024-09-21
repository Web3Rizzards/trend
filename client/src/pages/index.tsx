import CreatePost from "@/components/CreatePost";
import CreateAccount from "@/components/CreateAccount";
import Reaction from "@/components/Reaction";

export default function Home() {
  return (
    <>
      <CreatePost />
      <CreateAccount />
      <Reaction />
    </>
  );
}
