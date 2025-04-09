import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Theft Detection System",
  description: "Advanced theft detection system with multi-camera support",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-black min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <Navbar />
          <div className="flex-grow">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
