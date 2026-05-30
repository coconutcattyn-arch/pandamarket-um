import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PandaMarket",
  description: "UM校园交易社区"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
