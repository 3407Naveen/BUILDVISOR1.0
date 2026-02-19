import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { AssistantPanel } from "@/components/ai/AssistantPanel";

export const metadata: Metadata = {
  title: "BuildVisor - AI Home Builder",
  description: "Generate parametric 3D homes with natural language",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className="font-sans antialiased"
      >
        <Navbar />
        <AssistantPanel />
        <main className="pt-24 h-screen w-full relative flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
