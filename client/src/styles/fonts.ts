import { Montserrat, Londrina_Solid } from "next/font/google";

const montserratFont = Montserrat({
  weight: ["100", "200", "300", "400", "600", "700", "800"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const londrinaSolidFont = Londrina_Solid({
  weight: ["100", "300", "400", "900"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

const baseFont = londrinaSolidFont;

export default baseFont;
