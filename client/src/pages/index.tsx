import Posts from "@/components/Posts";
import { styled } from "styled-components";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export default function Home() {
  return (
    <HomeContainer>
      <Posts />
    </HomeContainer>
  );
}
