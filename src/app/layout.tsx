"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
import "node_modules/react-modal-video/css/modal-video.css";
import "../styles/index.css";
import { usePathname } from "next/navigation";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Define the routes where `dashHeader` should be true
  const dashHeaderRoutes = ["/dashboard", "/dashboard/settings"];
  const dashHeader = dashHeaderRoutes.includes(pathname);

  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <Providers>
          {!dashHeader && <Header />}
          {children}
          {!dashHeader && <Footer />}
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
