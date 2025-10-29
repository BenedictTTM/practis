import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/Components/Toast/toast";
import ReactQueryProvider from "@/Components/Providers/ReactQueryProvider";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sellr",
  description: "Sellr platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className={`${inter.variable} antialiased bg-gray-50`}>
        <ReactQueryProvider>
          {children}
          {/* Keep ToastProvider at root level for global notifications */}
          <ToastProvider
            position="top-right"
            richColors={true}
            closeButton={true}
            expand={true}
            duration={3000}
            theme="light"
          />
        </ReactQueryProvider>
      </body>
    </html>
  );
}