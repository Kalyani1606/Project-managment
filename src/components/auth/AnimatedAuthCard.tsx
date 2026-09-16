"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  IdCard,
  GraduationCap
} from "lucide-react";

interface AnimatedAuthCardProps {
  initialTab?: "login" | "register";
  isModal?: boolean;
  onCloseModal?: () => void;
}

export function AnimatedAuthCard({
  initialTab = "login",
  isModal = false,
  onCloseModal
}: AnimatedAuthCardProps) {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useNotification();

  const [tab, setTab] = useState<"login" | "register" | "forgot">(initialTab);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(true);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regRoll, setRegRoll] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid credentials. Please try again.");

      showToast(`Welcome back, ${data.user.name}!`, "success");
      login(data.user);
      if (onCloseModal) onCloseModal();
      router.push("/student");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName || "Student User",
          rollNumber: regRoll || `USN-${Math.floor(1000 + Math.random() * 9000)}`,
          semester: 6,
          department: "Computer Science & Engineering",
          collegeEmail: regEmail,
          password: regPassword || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed. Please check details.");

      showToast("Account created successfully! Switching to sign in...", "success");
      if (data.generatedPassword && !regPassword) {
        setLoginPassword(data.generatedPassword);
      } else {
        setLoginPassword(regPassword);
      }
      setLoginEmail(regEmail);
      setTab("login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isRegisterState = tab === "register";

  // Silky smooth cubic-bezier easing for perfect horizontal panel swap
  const transitionConfig = {
    duration: 0.65,
    ease: [0.65, 0, 0.35, 1],
  };

  return (
    <div className="w-full h-screen min-h-screen flex flex-col items-center justify-center bg-[#FCFCFA]">
      {/* Main Container Card (Edge-to-Edge Full Screen) */}
      <div className="relative w-full h-full min-h-screen bg-[#FCFCFA] overflow-hidden flex">
        
        {/* ========================================================================= */}
        {/* PANEL 1: WHITE FORM CARD PANEL                                            */}
        {/* Horizontal Shift: Starts at left (0%), slides right (100% -> left: 50%)    */}
        {/* ========================================================================= */}
        <motion.div
          initial={false}
          animate={{
            x: isRegisterState ? "100%" : "0%",
          }}
          transition={transitionConfig}
          className="absolute top-0 left-0 w-full md:w-1/2 h-full p-8 sm:p-10 md:p-12 flex flex-col justify-between bg-[#FCFCFA] z-10"
        >
          {/* Top Form Brand Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0B2E26] flex items-center justify-center text-[#E2C889] shadow-sm">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-bold tracking-wider text-xs uppercase text-[#0B2E26]">
                PROJECT HUB
              </span>
            </div>

            {isModal && onCloseModal && (
              <button
                type="button"
                onClick={onCloseModal}
                className="text-slate-400 hover:text-slate-700 text-xs font-semibold px-2 py-1 rounded-md hover:bg-slate-100 transition"
              >
                ✕ Close
              </button>
            )}
          </div>

          {/* Dynamic Form Content Transition (Sign in <-> Create account) */}
          <div className="my-auto">
            <AnimatePresence mode="wait">
              {isRegisterState ? (
                /* ==================== CREATE ACCOUNT FORM ==================== */
                <motion.div
                  key="register-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3.5"
                >
                  <div className="mb-4">
                    <h2 className="text-3xl font-extrabold text-[#111111] tracking-tight mb-1.5">
                      Create account
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Register your student details to get started.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-red-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleRegisterSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="Alex Morgan"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#FAF2EC]/80 border border-[#EADBD0] rounded-xl text-[#111827] text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#C69A59] focus:ring-1 focus:ring-[#C69A59] transition"
                        />
                        <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          placeholder="student@college.edu"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#FAF2EC]/80 border border-[#EADBD0] rounded-xl text-[#111827] text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#C69A59] focus:ring-1 focus:ring-[#C69A59] transition"
                        />
                        <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        USN / Roll Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="1MS21CS045"
                          value={regRoll}
                          onChange={(e) => setRegRoll(e.target.value.toUpperCase())}
                          className="w-full px-4 py-2.5 bg-[#FAF2EC]/80 border border-[#EADBD0] rounded-xl text-[#111827] text-sm uppercase placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#C69A59] focus:ring-1 focus:ring-[#C69A59] transition"
                        />
                        <IdCard className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="Use 8 characters or more."
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#FAF2EC]/80 border border-[#EADBD0] rounded-xl text-[#111827] text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#C69A59] focus:ring-1 focus:ring-[#C69A59] transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 mt-2 bg-[#0B2E26] hover:bg-[#07211C] text-[#E2C889] font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      <span>{isLoading ? "Creating account..." : "Create account"}</span>
                      {!isLoading && <ArrowRight className="w-4 h-4 text-[#E2C889]" />}
                    </button>
                  </form>
                </motion.div>
              ) : (
                /* ==================== SIGN IN FORM ==================== */
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div className="mb-4">
                    <h2 className="text-3xl font-extrabold text-[#111111] tracking-tight mb-1.5">
                      Sign in
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Enter your college email & password to log in.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-red-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Username or email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          placeholder="student@college.edu"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="w-full px-4 py-3 bg-[#FAF2EC]/80 border border-[#EADBD0] rounded-xl text-[#111827] text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#C69A59] focus:ring-1 focus:ring-[#C69A59] transition"
                        />
                        <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="Enter password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full px-4 py-3 bg-[#FAF2EC]/80 border border-[#EADBD0] rounded-xl text-[#111827] text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#C69A59] focus:ring-1 focus:ring-[#C69A59] transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={keepSignedIn}
                          onChange={(e) => setKeepSignedIn(e.target.checked)}
                          className="w-4 h-4 rounded border-[#EADBD0] accent-[#0B2E26] text-[#0B2E26] focus:ring-[#0B2E26] cursor-pointer"
                        />
                        <span className="text-xs font-medium text-slate-600">Keep me signed in</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setTab("forgot")}
                        className="text-xs font-semibold text-[#B89552] hover:text-[#9A7A3E] underline underline-offset-2 transition"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 mt-3 bg-[#0B2E26] hover:bg-[#07211C] text-[#E2C889] font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      <span>{isLoading ? "Signing in..." : "Sign in"}</span>
                      {!isLoading && <ArrowRight className="w-4 h-4 text-[#E2C889]" />}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Switcher Footer */}
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-600 font-medium flex items-center justify-center gap-1.5">
            {isRegisterState ? (
              <>
                <span>Already have an account?</span>
                <button
                  type="button"
                  onClick={() => { setError(null); setTab("login"); }}
                  className="font-semibold text-[#B89552] hover:text-[#9A7A3E] underline underline-offset-2 transition cursor-pointer"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                <span>New to Project Hub?</span>
                <button
                  type="button"
                  onClick={() => { setError(null); setTab("register"); }}
                  className="font-semibold text-[#B89552] hover:text-[#9A7A3E] underline underline-offset-2 transition cursor-pointer"
                >
                  Create an account
                </button>
              </>
            )}
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* PANEL 2: DEEP GREEN HERO BLADE PANEL                                       */}
        {/* Horizontal Shift: Starts at right (0%), slides left (-100% -> left: 0)     */}
        {/* ========================================================================= */}
        <motion.div
          initial={false}
          animate={{
            x: isRegisterState ? "-100%" : "0%",
          }}
          transition={transitionConfig}
          className="hidden md:flex absolute top-0 left-1/2 w-1/2 h-full z-20 overflow-hidden bg-gradient-to-br from-[#0B2E26] via-[#08241E] to-[#041612] p-10 md:p-12 flex-col justify-between border-x border-[#1a4439]/60 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          {/* Ambient Radial Mesh Orbs */}
          <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-[radial-gradient(circle_at_70%_20%,rgba(226,200,137,0.15),transparent_70%)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[radial-gradient(circle_at_20%_80%,rgba(11,46,38,0.5),transparent_70%)] pointer-events-none" />

          {/* Curvilinear Vector Lines */}
          <svg
            className="absolute inset-0 w-full h-full opacity-25 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M -100,200 C 150,50 300,450 600,250 C 750,150 850,350 1000,100"
              fill="none"
              stroke="#E2C889"
              strokeWidth="1.5"
            />
            <path
              d="M -50,400 C 200,150 400,550 700,300 C 850,200 950,400 1100,200"
              fill="none"
              stroke="#E2C889"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          </svg>

          {/* Brand Tag */}
          <div className="relative z-10">
            <span className="text-[11px] font-semibold tracking-[0.35em] text-[#E2C889]/90 uppercase">
              PROJECT HUB
            </span>
          </div>

          {/* Hero Content Cross-fade with Horizontal Motion */}
          <div className="relative z-10 my-auto py-12">
            <AnimatePresence mode="wait">
              {isRegisterState ? (
                <motion.div
                  key="register-hero-text"
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.28 }}
                  className="space-y-4"
                >
                  <h3 className="font-serif-luxury text-4xl sm:text-5xl text-[#F2E5C9] font-normal leading-[1.15] tracking-tight">
                    Start the <br />
                    <span className="italic font-light text-[#E2C889]">first page.</span>
                  </h3>
                  <p className="text-sm sm:text-[15px] text-[#A5BDAE] leading-relaxed max-w-sm font-normal">
                    One account for every board, every draft and every device you own.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="login-hero-text"
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 25 }}
                  transition={{ duration: 0.28 }}
                  className="space-y-4"
                >
                  <h3 className="font-serif-luxury text-4xl sm:text-5xl text-[#F2E5C9] font-normal leading-[1.15] tracking-tight">
                    Welcome <br />
                    <span className="italic font-light text-[#E2C889]">back.</span>
                  </h3>
                  <p className="text-sm sm:text-[15px] text-[#A5BDAE] leading-relaxed max-w-sm font-normal">
                    Your boards, your drafts and your people are exactly where you left them.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Security Badge */}
          <div className="relative z-10 pt-4 flex items-center gap-2.5 text-xs text-[#8BA495]">
            <ShieldCheck className="w-4 h-4 text-[#E2C889]" />
            <span>Encrypted Institutional Academic Portal</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
