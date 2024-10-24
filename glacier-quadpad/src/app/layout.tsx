import type { Metadata } from "next";

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
        <link rel="shortcut icon" href="/quadpad.png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
