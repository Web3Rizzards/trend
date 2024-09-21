import React, { FC, useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import { ThemeEnum, useThemeUpdater } from "@/context/useThemeUpdater";
import LightTheme from "./tokens/light";
import DarkTheme from "./tokens/dark";

interface IProps {
  children: React.ReactNode | React.ReactNode[];
}

const Theme: FC<IProps> = ({ children }) => {
  const { theme } = useThemeUpdater();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // prevents ssr flash for mismatched dark mode
  if (!mounted) return null;

  return (
    <ThemeProvider theme={theme === ThemeEnum.LIGHT ? LightTheme : DarkTheme}>
      {children}
    </ThemeProvider>
  );
};

export default Theme;
