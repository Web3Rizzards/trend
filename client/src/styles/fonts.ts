import { Montserrat } from "next/font/google";

const montserratFont = Montserrat({
  weight: ["100", "200", "300", "400", "600", "700", "800"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const baseFont = montserratFont;

export default baseFont;
