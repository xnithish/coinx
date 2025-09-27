import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AppSidebar } from "@/components/header/SideHeader";
import { ThemeProvider } from "@/contexts/theme-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Coinx - Cryptocurrency Portfolio Manager",
  description: "Manage your cryptocurrency portfolio with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased`}
      >
        <ThemeProvider>
          <AppSidebar>{children}</AppSidebar>
        </ThemeProvider>
      </body>
    </html>
  );
}
