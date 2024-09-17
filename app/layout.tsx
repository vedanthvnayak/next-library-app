import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/IslandHeader";
import Footer from "@/components/ui/footer";
import OpenAiChatBot from "@/components/ui/OpenAiChatBot";
import AuthProvider from "@/components/AuthProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jñāna Bhāṇḍāra",
  description: "A library management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <SpeedInsights />
          <Footer />

          <OpenAiChatBot />
        </AuthProvider>
      </body>
    </html>
  );
}
