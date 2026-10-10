import type { Metadata } from "next";
import { Merriweather, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { AcademicDataProvider } from "@/context/AcademicDataContext";
import { AppProvider } from "@/context/AppContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { DevMailboxModal } from "@/components/common/DevMailboxModal";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Project Hub - Academic Project Management Platform",
  description: "Comprehensive project tracking, team formation, faculty guidance diary, reviewer evaluation, and coordinator management platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${merriweather.variable} ${inter.variable}`}>
      <body className="bg-[#FAF2EC] text-slate-900 min-h-screen antialiased selection:bg-[#FF5F38] selection:text-white font-sans">
        <AuthProvider>
          <NotificationProvider>
            <AcademicDataProvider>
              <AppProvider>
                {children}
                <AuthModal />
                <DevMailboxModal />
              </AppProvider>
            </AcademicDataProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
