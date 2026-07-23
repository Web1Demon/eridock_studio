import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Eridock Studio",
    template: "%s · Eridock Studio",
  },
  description:
    "The internal content creation platform powering the Eridock learning ecosystem. Create, review, and publish world-class educational content.",
  keywords: ["eridock", "studio", "education", "content creation", "curriculum"],
  authors: [{ name: "Eridock" }],
  creator: "Eridock",
  metadataBase: new URL("https://studio.eridock.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Eridock Studio",
    description: "Educational content creation platform.",
    siteName: "Eridock Studio",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontSans.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
