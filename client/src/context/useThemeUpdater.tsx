import STORAGE from "@/configuration/storage";
import React, { useEffect, useState } from "react";
import { PropsWithChildren } from "react";

export enum ThemeEnum {
  LIGHT = "LIGHT",
  DARK = "DARK",
}

type State = {
  theme: ThemeEnum;
  toggleTheme: () => void;
};

const initialState: State = {
  theme: ThemeEnum.LIGHT,
  toggleTheme: () => {},
};

const ThemeUpdaterContext = React.createContext<State>(initialState);

const ThemeUpdaterProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<ThemeEnum>(ThemeEnum.LIGHT);

  const toggleTheme = () => {
    const newTheme =
      theme === ThemeEnum.LIGHT ? ThemeEnum.DARK : ThemeEnum.LIGHT;
    localStorage.setItem(STORAGE.theme, newTheme);
    setTheme(newTheme);
  };

  useEffect(() => {
    const localTheme = localStorage.getItem(STORAGE.theme);
    if (localTheme) {
      setTheme(
        localTheme === ThemeEnum.DARK ? ThemeEnum.DARK : ThemeEnum.LIGHT
      );
    } else {
      const isSystemDarkTheme =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(isSystemDarkTheme ? ThemeEnum.DARK : ThemeEnum.LIGHT);
    }
  }, []);

  return (
    <ThemeUpdaterContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeUpdaterContext.Provider>
  );
};

const useThemeUpdater = () => {
  const context = React.useContext(ThemeUpdaterContext);
  if (context === undefined) {
    throw new Error("useThemeUpdater do not have context");
  }
  return context;
};

export { ThemeUpdaterProvider, useThemeUpdater };
