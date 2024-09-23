import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ".././globals.css";
import Header from "@/components/ui/IslandHeader";
import Footer from "@/components/ui/footer";
import OpenAiChatBot from "@/components/ui/OpenAiChatBot";
import AuthProvider from "@/components/AuthProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jñāna Bhāṇḍāra",
  description: "A library management app",
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <Header />
            <main>{children}</main>
            <SpeedInsights />
            <Footer />

            <OpenAiChatBot />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
