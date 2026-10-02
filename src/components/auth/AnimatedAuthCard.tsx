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
  GraduationCap,
  Award,
  Briefcase
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
  const [role, setRole] = useState<"STUDENT" | "MENTOR" | "COORDINATOR">("STUDENT");
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(true);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regRoll, setRegRoll] = useState("");
  const [regDept, setRegDept] = useState("Computer Science & Engineering");
  const [regDesignation, setRegDesignation] = useState("Assistant Professor");
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
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
          selectedRole: role,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid credentials. Please try again.");

      showToast(`Welcome back, ${data.user.name}!`, "success");
      login(data.user);
      if (onCloseModal) onCloseModal();
      if (data.user.role === "COORDINATOR" || role === "COORDINATOR") {
        router.push("/coordinator");
      } else if (data.user.role === "TEACHER" || data.user.role === "HOD" || role === "MENTOR") {
        router.push("/mentor");
      } else {
        router.push("/student");
      }
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
      const payload = role === "STUDENT" ? {
        role: "STUDENT",
        name: regName || "Student User",
        rollNumber: regRoll || `USN-${Math.floor(1000 + Math.random() * 9000)}`,
        semester: 6,
        department: "Computer Science & Engineering",
        collegeEmail: regEmail,
        password: regPassword || undefined,
      } : role === "MENTOR" ? {
        role: "MENTOR",
        name: regName || "Faculty Mentor",
        department: regDept || "Computer Science & Engineering",
        designation: regDesignation || "Assistant Professor",
        collegeEmail: regEmail,
        password: regPassword || undefined,
      } : {
        role: "COORDINATOR",
        name: regName || "Academic Coordinator",
        department: regDept || "Computer Science & Engineering",
        designation: "Head of Department & Project Coordinator",
        collegeEmail: regEmail,
        password: regPassword || undefined,
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    <div className="w-full h-screen min-h-screen flex flex-col items-center justify-center bg-[#FAF2EC]">
      {/* Main Container Card (Edge-to-Edge Full Screen) */}
      <div className="relative w-full h-full min-h-screen bg-[#FAF2EC] overflow-hidden flex">
        
        {/* ========================================================================= */}
        {/* PANEL 1: CREAM/WHITE FORM CARD PANEL                                       */}
        {/* Horizontal Shift: Starts at left (0%), slides right (100% -> left: 50%)    */}
        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* PANEL 1: CREAM/WHITE FORM CARD PANEL                                       */}
        {/* Horizontal Shift: Starts at left (0%), slides right (100% -> left: 50%)    */}
        {/* ========================================================================= */}
        <motion.div
          initial={false}
          animate={{
            x: isRegisterState ? "100%" : "0%",
          }}
          transition={transitionConfig}
          className="absolute top-0 left-0 w-full md:w-1/2 h-full px-6 sm:px-10 md:px-12 lg:px-16 py-8 sm:py-10 flex flex-col justify-between bg-[#FAF2EC] z-10 overflow-y-auto"
        >
          {/* Inner Responsive Max-Width Container */}
          <div className="w-full max-w-md mx-auto h-full flex flex-col justify-between">
            {/* Top Form Brand Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0A1628] flex items-center justify-center text-[#FF5F38] shadow-sm">
                  <GraduationCap className="w-4 h-4 text-[#FF5F38]" />
                </div>
                <span className="font-extrabold tracking-tight text-sm text-[#111827]">
                  PROJECT HUB<span className="text-[#FF5F38] text-base font-black">.</span>
                </span>
              </div>

              {isModal && onCloseModal && (
                <button
                  type="button"
                  onClick={onCloseModal}
                  className="md:hidden text-slate-600 hover:text-[#111827] text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-[#EADBD0]/60 transition flex items-center gap-1 cursor-pointer"
                >
                  ✕ Close
                </button>
              )}
            </div>

            {/* Dynamic Form Content Transition (Sign in <-> Create account) */}
            <div className="my-auto py-4">
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
                    <div className="mb-2">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mb-1">
                        Create account
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium">
                        {role === "STUDENT"
                          ? "Register your student details to get started."
                          : role === "MENTOR"
                          ? "Register your faculty mentor details to get started."
                          : "Register your coordinator details to get started."}
                      </p>
                    </div>

                    {/* Role Selector Tabs (Student vs Mentor vs Coordinator) */}
                    <div className="flex p-1 bg-[#EADBD0]/60 rounded-xl mb-3 border border-[#EADBD0]">
                      <button
                        type="button"
                        onClick={() => { setRole("STUDENT"); setError(null); }}
                        className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                          role === "STUDENT"
                            ? "bg-white text-[#111827] shadow-sm border border-black/5"
                            : "text-slate-600 hover:text-[#111827]"
                        }`}
                      >
                        <GraduationCap className={`w-3.5 h-3.5 ${role === "STUDENT" ? "text-[#FF5F38]" : "text-slate-400"}`} />
                        <span>Student</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setRole("MENTOR"); setError(null); }}
                        className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                          role === "MENTOR"
                            ? "bg-white text-[#111827] shadow-sm border border-black/5"
                            : "text-slate-600 hover:text-[#111827]"
                        }`}
                      >
                        <Award className={`w-3.5 h-3.5 ${role === "MENTOR" ? "text-[#FF5F38]" : "text-slate-400"}`} />
                        <span>Mentor</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setRole("COORDINATOR"); setError(null); }}
                        className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                          role === "COORDINATOR"
                            ? "bg-white text-[#111827] shadow-sm border border-black/5"
                            : "text-slate-600 hover:text-[#111827]"
                        }`}
                      >
                        <ShieldCheck className={`w-3.5 h-3.5 ${role === "COORDINATOR" ? "text-[#FF5F38]" : "text-slate-400"}`} />
                        <span>Coordinator</span>
                      </button>
                    </div>

                    {error && (
                      <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-red-600 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                        <span>{error}</span>
                      </div>
                    )}

                    <form onSubmit={handleRegisterSubmit} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#111827] mb-1">
                          Full name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder={
                              role === "STUDENT"
                                ? "Alex Morgan"
                                : role === "MENTOR"
                                ? "Dr. Aris Thorne"
                                : "Dr. Marcus Sterling"
                            }
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-[#EADBD0] rounded-xl text-[#111827] text-sm placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#FF5F38] focus:ring-1 focus:ring-[#FF5F38] transition shadow-xs"
                          />
                          <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#111827] mb-1">
                          {role === "STUDENT"
                            ? "College email address"
                            : role === "MENTOR"
                            ? "Faculty email address"
                            : "Coordinator email address"}
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            placeholder={
                              role === "STUDENT"
                                ? "student@college.edu"
                                : role === "MENTOR"
                                ? "dr.aris@engg.college.edu"
                                : "coordinator@college.edu"
                            }
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-[#EADBD0] rounded-xl text-[#111827] text-sm placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#FF5F38] focus:ring-1 focus:ring-[#FF5F38] transition shadow-xs"
                          />
                          <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      {role === "STUDENT" ? (
                        <div>
                          <label className="block text-xs font-semibold text-[#111827] mb-1">
                            USN / Roll Number
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              placeholder="1MS21CS045"
                              value={regRoll}
                              onChange={(e) => setRegRoll(e.target.value.toUpperCase())}
                              className="w-full px-4 py-2.5 bg-white border border-[#EADBD0] rounded-xl text-[#111827] text-sm uppercase placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#FF5F38] focus:ring-1 focus:ring-[#FF5F38] transition shadow-xs"
                            />
                            <IdCard className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-semibold text-[#111827] mb-1">
                              Department
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Computer Science"
                              value={regDept}
                              onChange={(e) => setRegDept(e.target.value)}
                              className="w-full px-3 py-2.5 bg-white border border-[#EADBD0] rounded-xl text-[#111827] text-xs placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#FF5F38] focus:ring-1 focus:ring-[#FF5F38] transition shadow-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-[#111827] mb-1">
                              Designation
                            </label>
                            <select
                              value={regDesignation}
                              onChange={(e) => setRegDesignation(e.target.value)}
                              className="w-full px-3 py-2.5 bg-white border border-[#EADBD0] rounded-xl text-[#111827] text-xs focus:outline-none focus:bg-white focus:border-[#FF5F38] focus:ring-1 focus:ring-[#FF5F38] transition shadow-xs cursor-pointer"
                            >
                              <option value="Professor">Professor</option>
                              <option value="Associate Professor">Associate Professor</option>
                              <option value="Assistant Professor">Assistant Professor</option>
                              <option value="Head of Dept (HOD)">Head of Dept (HOD)</option>
                            </select>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-[#111827] mb-1">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="Use 8 characters or more."
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-[#EADBD0] rounded-xl text-[#111827] text-sm placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#FF5F38] focus:ring-1 focus:ring-[#FF5F38] transition shadow-xs"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#FF5F38] p-1 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 mt-2 bg-[#FF5F38] hover:bg-[#E54D26] text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg shadow-[#FF5F38]/25 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                      >
                        <span>
                          {isLoading
                            ? "Creating account..."
                            : role === "STUDENT"
                            ? "Create student account"
                            : role === "MENTOR"
                            ? "Create mentor account"
                            : "Create coordinator account"}
                        </span>
                        {!isLoading && <ArrowRight className="w-4 h-4 text-white" />}
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
                    <div className="mb-3">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mb-1.5">
                        Sign in
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium">
                        {role === "STUDENT"
                          ? "Enter your student email & password to log in."
                          : role === "MENTOR"
                          ? "Enter your faculty mentor email & password to log in."
                          : "Enter your coordinator email & password to log in."}
                      </p>
                    </div>

                    {/* Role Selector Tabs (Student vs Mentor vs Coordinator) */}
                    <div className="flex p-1 bg-[#EADBD0]/60 rounded-xl mb-3 border border-[#EADBD0]">
                      <button
                        type="button"
                        onClick={() => { setRole("STUDENT"); setError(null); }}
                        className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                          role === "STUDENT"
                            ? "bg-white text-[#111827] shadow-sm border border-black/5"
                            : "text-slate-600 hover:text-[#111827]"
                        }`}
                      >
                        <GraduationCap className={`w-3.5 h-3.5 ${role === "STUDENT" ? "text-[#FF5F38]" : "text-slate-400"}`} />
                        <span>Student</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setRole("MENTOR"); setError(null); }}
                        className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                          role === "MENTOR"
                            ? "bg-white text-[#111827] shadow-sm border border-black/5"
                            : "text-slate-600 hover:text-[#111827]"
                        }`}
                      >
                        <Award className={`w-3.5 h-3.5 ${role === "MENTOR" ? "text-[#FF5F38]" : "text-slate-400"}`} />
                        <span>Mentor</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setRole("COORDINATOR"); setError(null); }}
                        className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                          role === "COORDINATOR"
                            ? "bg-white text-[#111827] shadow-sm border border-black/5"
                            : "text-slate-600 hover:text-[#111827]"
                        }`}
                      >
                        <ShieldCheck className={`w-3.5 h-3.5 ${role === "COORDINATOR" ? "text-[#FF5F38]" : "text-slate-400"}`} />
                        <span>Coordinator</span>
                      </button>
                    </div>

                    {error && (
                      <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-red-600 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                        <span>{error}</span>
                      </div>
                    )}

                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#111827] mb-1">
                          {role === "STUDENT"
                            ? "Student email address"
                            : role === "MENTOR"
                            ? "Faculty email address"
                            : "Coordinator email address"}
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            placeholder={
                              role === "STUDENT"
                                ? "student@college.edu"
                                : role === "MENTOR"
                                ? "dr.aris@engg.college.edu"
                                : "coordinator@college.edu"
                            }
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-[#EADBD0] rounded-xl text-[#111827] text-sm placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#FF5F38] focus:ring-1 focus:ring-[#FF5F38] transition shadow-xs"
                          />
                          <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#111827] mb-1">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="Enter password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-[#EADBD0] rounded-xl text-[#111827] text-sm placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#FF5F38] focus:ring-1 focus:ring-[#FF5F38] transition shadow-xs"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#FF5F38] p-1 transition-colors"
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
                            className="w-4 h-4 rounded border-[#EADBD0] accent-[#FF5F38] text-[#FF5F38] focus:ring-[#FF5F38] cursor-pointer"
                          />
                          <span className="text-xs font-medium text-slate-600">Keep me signed in</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setTab("forgot")}
                          className="text-xs font-bold text-[#FF5F38] hover:text-[#E54D26] underline underline-offset-2 transition"
                        >
                          Forgot password?
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 mt-3 bg-[#FF5F38] hover:bg-[#E54D26] text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg shadow-[#FF5F38]/25 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                      >
                        <span>
                          {isLoading
                            ? "Signing in..."
                            : role === "STUDENT"
                            ? "Sign in as Student"
                            : role === "MENTOR"
                            ? "Sign in as Mentor"
                            : "Sign in as Coordinator"}
                        </span>
                        {!isLoading && <ArrowRight className="w-4 h-4 text-white" />}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Switcher Footer */}
            <div className="pt-4 border-t border-[#EADBD0] text-xs text-slate-600 font-medium flex items-center justify-center gap-1.5">
              {isRegisterState ? (
                <>
                  <span>Already have an account?</span>
                  <button
                    type="button"
                    onClick={() => { setError(null); setTab("login"); }}
                    className="font-bold text-[#FF5F38] hover:text-[#E54D26] underline underline-offset-2 transition cursor-pointer"
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
                    className="font-bold text-[#FF5F38] hover:text-[#E54D26] underline underline-offset-2 transition cursor-pointer"
                  >
                    Create an account
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* PANEL 2: DARK NAVY HERO BLADE PANEL WITH ORANGE CIRCULAR ARTWORK         */}
        {/* Horizontal Shift: Starts at right (0%), slides left (-100% -> left: 0)     */}
        {/* ========================================================================= */}
        <motion.div
          initial={false}
          animate={{
            x: isRegisterState ? "-100%" : "0%",
          }}
          transition={transitionConfig}
          style={{
            clipPath: isRegisterState
              ? "polygon(0% 0%, 100% 0%, 92% 100%, 0% 100%)"
              : "polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%)",
          }}
          className="hidden md:flex absolute top-0 left-1/2 w-1/2 h-full z-20 overflow-hidden bg-[#0A1628] p-10 md:p-12 lg:p-16 flex-col justify-between shadow-2xl border-l border-slate-800/80"
        >
          {/* Top-Right Decorative Reddish-Orange Blob Circle */}
          <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-gradient-to-br from-[#BA3C1B] via-[#8C2910] to-[#5C1605] opacity-90 pointer-events-none blur-[1px]" />

          {/* Bottom-Right Concentric Orange Circles */}
          <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full bg-gradient-to-tl from-[#FF5F38] via-[#E04B24] to-[#7D210A] opacity-95 pointer-events-none shadow-2xl" />
          <div className="absolute -bottom-24 -right-24 w-[380px] h-[380px] rounded-full bg-gradient-to-tl from-[#FF6B47] via-[#E84E27] to-[#A83214] opacity-90 pointer-events-none" />

          {/* Curvilinear Wavy Orange Vector Lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 600 800"
            preserveAspectRatio="none"
          >
            {/* Primary Bright Orange Wavy Line */}
            <path
              d="M -50,230 C 120,220 280,410 650,290"
              fill="none"
              stroke="#FF5F38"
              strokeWidth="2.5"
            />
            {/* Secondary Dashed Orange Line */}
            <path
              d="M -30,480 C 220,320 380,560 680,360"
              fill="none"
              stroke="#FF5F38"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              opacity="0.6"
            />
          </svg>

          {/* Brand Tag Header */}
          <div className="relative z-20 flex items-center justify-between">
            <span className="text-xs font-black tracking-[0.25em] text-white uppercase flex items-center gap-1">
              PROJECT HUB<span className="text-[#FF5F38] text-sm font-black">.</span>
            </span>
            {isModal && onCloseModal && (
              <button
                type="button"
                onClick={onCloseModal}
                className="text-slate-800 hover:text-black bg-white hover:bg-slate-100 text-xs font-bold px-4 py-2 rounded-full shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                ✕ Close
              </button>
            )}
          </div>

          {/* Hero Content Cross-fade with Horizontal Motion */}
          <div className="relative z-20 my-auto py-12">
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
                  <h3 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.1] tracking-tight">
                    Start the <br />
                    <span className="italic font-light text-[#FF5F38]">first page.</span>
                  </h3>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-sm font-normal">
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
                  <h3 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.1] tracking-tight">
                    Welcome <br />
                    <span className="italic font-light text-[#FF5F38]">back.</span>
                  </h3>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-sm font-normal">
                    Your boards, your drafts and your people are exactly where you left them.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Security Badge */}
          <div className="relative z-20 pt-4 flex items-center gap-2.5 text-xs text-slate-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#FF5F38]" />
            <span>Encrypted Institutional Academic Portal</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
