import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { AcademicDataProvider } from "@/context/AcademicDataContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { DevMailboxModal } from "@/components/common/DevMailboxModal";

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
    <html lang="en">
      <body className="bg-[#FAF2EC] text-slate-900 min-h-screen antialiased selection:bg-[#FF5F38] selection:text-white">
        <AuthProvider>
          <NotificationProvider>
            <AcademicDataProvider>
              {children}
              <AuthModal />
              <DevMailboxModal />
            </AcademicDataProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
