import type { Metadata } from "next";
import SelectedStyle from "./SelectedStyle";

export const metadata: Metadata = {
  title: "GlacierOS",
  description: "A casual build of GlacierOS",
  icons: {
    icon: "/windows/glacierMacLarge.webp",
    shortcut: "/windows/glacierMacLarge.webp",
    apple: "/windows/glacierMacLarge.webp",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/windows/glacierMacLarge.webp",
    },
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <SelectedStyle/>
        <link rel="shortcut icon" href="/windows/glacierMacLarge.webp" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
