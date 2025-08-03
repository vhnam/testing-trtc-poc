import { Geist } from "next/font/google";
import { PropsWithChildren } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const Layout = ({ children }: PropsWithChildren) => {
  return <div className={`${geistSans.className} font-sans`}>{children}</div>;
};

export default Layout;
