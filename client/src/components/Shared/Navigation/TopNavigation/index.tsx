import { LegacyRef, forwardRef } from "react";
import {
  TopNavigationContainer,
  TopNavigationIcon,
  TopNavigationSection,
} from "./style";
import Link from "next/link";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import WorldId from "@/components/WorldID";
import ThemeToggle from "../../Theme/ThemeToggle";
import { useAccount } from "wagmi";

const TopNavigation = forwardRef((_, ref: LegacyRef<HTMLElement>) => {
  const { address } = useAccount();

  return (
    <TopNavigationContainer ref={ref}>
      <Link href="/">
        <TopNavigationIcon>Trend</TopNavigationIcon>
      </Link>
      <TopNavigationSection>
        <ThemeToggle />
        {address && <WorldId />}
        <DynamicWidget />
      </TopNavigationSection>
    </TopNavigationContainer>
  );
});

export default TopNavigation;
