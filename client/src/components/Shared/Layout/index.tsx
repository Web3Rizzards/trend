import { LayoutContainer, LayoutContent } from "./style";
import { useEffect, useRef, useState } from "react";
import TopNavigation from "../Navigation/TopNavigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const topNavigationRef = useRef<HTMLDivElement>(null);
  const [topNavigationOffset, setTopNavigationOffset] = useState<number>(0);

  useEffect(() => {
    setTopNavigationOffset(topNavigationRef.current?.clientHeight ?? 0);
  }, [topNavigationRef.current]);

  return (
    <>
      <TopNavigation ref={topNavigationRef} />
      <LayoutContainer>
        <LayoutContent offset={topNavigationOffset}>{children}</LayoutContent>
      </LayoutContainer>
    </>
  );
};

export default Layout;
