import { Toaster } from "@/components/ui/toaster"
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

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
    <html lang="en">
      <body
        className={cn(
          "min-h-screen font-sans",
          fontSans.variable,
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
