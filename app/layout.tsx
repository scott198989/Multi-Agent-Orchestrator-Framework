import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Multi-Agent Orchestrator | AI Problem Solving Demo",
  description: "Watch a conductor agent route complex problems to specialized AI agents and synthesize expert responses in real-time.",
  keywords: ["AI", "multi-agent", "orchestration", "Claude", "problem solving"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
