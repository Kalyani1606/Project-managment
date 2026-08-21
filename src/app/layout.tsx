import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { DevMailboxModal } from "@/components/common/DevMailboxModal";

export const metadata: Metadata = {
  title: "Project Hub - Student Academic Project Management Platform",
  description: "Enterprise project management, team formation, and faculty mentorship platform for engineering students.",
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
            {children}
            <AuthModal />
            <DevMailboxModal />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
