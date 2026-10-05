import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { AcademicDataProvider } from "@/context/AcademicDataContext";
import { AppProvider } from "@/context/AppContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { DevMailboxModal } from "@/components/common/DevMailboxModal";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
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
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable}`}>
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
