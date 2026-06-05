import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tiệm Cắt Tóc Ba",
  description: "Tiệm cắt tóc gia đình với hơn 20 năm kinh nghiệm. Phục vụ tận tâm, kỹ lưỡng với mức giá hợp lý.",
  keywords: "cắt tóc, tiệm cắt tóc, barber shop, tóc đẹp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
