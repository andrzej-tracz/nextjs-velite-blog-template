import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Garden Shop",
  description: "Garden shop catalog — plants, furniture, and seasonal décor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-emerald-50/40 text-emerald-950 antialiased">
        {children}
      </body>
    </html>
  );
}
