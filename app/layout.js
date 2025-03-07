import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI-TDS | Theft Detection System",
  description: "AI-powered theft detection system using computer vision",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-black min-h-screen flex flex-col`}
      >
        <Navbar />
        <div className="flex-grow">{children}</div>
      </body>
    </html>
  );
}
