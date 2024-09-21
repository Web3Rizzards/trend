import { LegacyRef, forwardRef } from "react";
import {
  TopNavigationContainer,
  TopNavigationIcon,
  TopNavigationSection,
} from "./style";
import Link from "next/link";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import WorldId from "@/components/WorldID";

const TopNavigation = forwardRef((_, ref: LegacyRef<HTMLElement>) => {
  return (
    <TopNavigationContainer ref={ref}>
      <Link href="/">
        <TopNavigationIcon>Trend</TopNavigationIcon>
      </Link>
      <TopNavigationSection>
        <WorldId />
        <DynamicWidget />
      </TopNavigationSection>
    </TopNavigationContainer>
  );
});

export default TopNavigation;
