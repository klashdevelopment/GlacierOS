import type { Metadata } from "next";
import SelectedStyle from "./SelectedStyle";

export const metadata: Metadata = {
  title: "GlacierOS",
  description: "A stable reliable build of Glacier OS.",
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
        <link rel="shortcut icon" href="/windows/settings.svg" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
