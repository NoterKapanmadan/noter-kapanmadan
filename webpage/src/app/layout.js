import { Toaster } from "@/components/ui/toaster"
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import Header from "@/components/layout/Header";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: "NoterKapanmadan",
  description: "NoterKapanmadan | Second-hand Vehicle Buying and Selling System ",
};

export default function RootLayout({ children }) {
  return (
    <html className="h-full" lang="en">
      <body
        className={cn(
          "h-full font-sans",
          fontSans.variable,
        )}
      > 
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
