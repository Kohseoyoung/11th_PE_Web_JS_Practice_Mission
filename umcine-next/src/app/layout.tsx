import type { Metadata } from "next";
import { Suspense } from "react";
import { Providers } from "./providers";
import { Header } from "@/components/layout/header";
import Footer from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "umcine",
  icons: "/favicon.svg",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Suspense>
              <Header />
            </Suspense>
            <div className="flex flex-1 flex-col bg-gray-50 [&>main]:flex-1">
              <Suspense>{children}</Suspense>
            </div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}