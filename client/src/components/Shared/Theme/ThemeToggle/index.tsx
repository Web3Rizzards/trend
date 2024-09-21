import { ThemeEnum, useThemeUpdater } from "@/context/useThemeUpdater";
import { ThemeToggleContainer } from "./style";
import MoonSVG from "@/assets/icons/head-moon.png";
import SunSVG from "@/assets/icons/head-sunset.png";
import Image from "next/image";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeUpdater();

  return (
    <ThemeToggleContainer onClick={toggleTheme}>
      <Image
        src={theme === ThemeEnum.LIGHT ? SunSVG : MoonSVG}
        alt="Theme"
        fill
      />
    </ThemeToggleContainer>
  );
};

export default ThemeToggle;
