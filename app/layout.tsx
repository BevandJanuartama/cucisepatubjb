import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NEO Sneakers Lab | Nota Online",
  description: "Sistem Manajemen Cuci Sepatu Banjarbaru",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-white text-black`}>
        <main>{children}</main>
      </body>
    </html>
  );
}
