import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DevOptimizer from "@/components/dev/DevOptimizer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AliTrucks - Commercial Vehicle Rental Platform",
  description: "Your trusted platform for commercial vehicle rentals. Find and rent trucks for all your transportation needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <NotificationProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <DevOptimizer />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
