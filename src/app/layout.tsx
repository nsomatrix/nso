import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const minecraftFont = localFont({
  src: "../fonts/Minecraft.ttf",
  variable: "--font-minecraft",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Matrix",
  description: "Matrix — Online platform for Emulators, MODs, and digital assets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={minecraftFont.variable}
    >
      <body className={minecraftFont.className}>
        {children}
      </body>
    </html>
  );
}
