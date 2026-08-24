"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Play,
  UserCheck,
  ArrowUpRight,
  Check
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SingleHeroLandingPage() {
  const { user, openAuthModal } = useAuth();

  return (
    <div className="min-h-screen bg-[#FAF2EC] text-[#111827] font-sans selection:bg-[#FF5F38] selection:text-white flex flex-col justify-between overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* TOP NAVIGATION HEADER                                                     */}
      {/* ========================================================================= */}
      <header className="w-full bg-[#FAF2EC] z-50 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tight text-[#111827] flex items-center">
              PROJECT HUB<span className="text-[#FF5F38] text-3xl font-black leading-none">.</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
            <Link
              href="/"
              className="text-[#FF5F38] font-bold flex items-center gap-1.5 transition"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F38]"></span>
              <span>Home</span>
            </Link>
            <a href="#about" className="hover:text-[#FF5F38] transition">
              About
            </a>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/student"
                className="bg-[#111827] hover:bg-black text-white px-6 py-2.5 rounded-full font-bold text-xs tracking-wide transition shadow-sm flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-[#FF5F38]" />
                <span>Dashboard ({user.name.split(" ")[0]})</span>
              </Link>
            ) : (
              <button
                onClick={() => openAuthModal("login")}
                className="bg-[#111827] hover:bg-black text-white px-6 py-2.5 rounded-full font-bold text-xs tracking-wide transition shadow-sm cursor-pointer"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN HERO SECTION (ONLY THIS MUCH)                                        */}
      {/* ========================================================================= */}
      <main className="flex-1 flex items-center py-6 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column - Headline & Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 space-y-6"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF5F38] text-white text-xs font-mono font-bold tracking-wider shadow-sm">
                <span>#Learning Platform</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#111827] tracking-tight leading-[1.1]">
                Smart Learning <br />
                Deeper &amp; More <br />
                <span className="text-[#FF5F38]">-Amazing</span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed max-w-lg">
                Phosfluorescently deploy unique intellectual capital without enterprise-after bricks &amp; clicks synergy. Enthusiastically revolutionize intuitive academic capstone projects &amp; mentorship.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-5">
                {/* Primary CTA */}
                <button
                  onClick={() => openAuthModal("register")}
                  className="bg-[#0B2E26] hover:bg-[#07211C] text-white px-7 py-3.5 rounded-full font-bold text-sm flex items-center gap-2.5 shadow-lg shadow-[#0B2E26]/25 transition transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Explore Projects</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                {/* Secondary CTA */}
                <button
                  onClick={() => openAuthModal("login")}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-[#FF5F38] group-hover:bg-[#E54D26] text-white flex items-center justify-center shadow-lg shadow-[#FF5F38]/25 transition transform group-hover:scale-105">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                  <span className="font-bold text-sm text-[#111827] group-hover:text-[#FF5F38] transition">
                    Learn More
                  </span>
                </button>
              </div>
            </motion.div>

            {/* Right Column - Hero Visual Artwork */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-6 relative flex justify-center lg:justify-end"
            >
              {/* Concentric Dashed Ring Background */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                <svg className="w-[480px] h-[480px]" viewBox="0 0 500 500" fill="none">
                  <circle cx="250" cy="250" r="160" stroke="#FF5F38" strokeWidth="1.5" strokeDasharray="6 6" />
                  <circle cx="250" cy="250" r="230" stroke="#111827" strokeWidth="1" strokeDasharray="8 8" />
                </svg>
              </div>

              {/* Central Visual Stage */}
              <div className="relative w-full max-w-md lg:max-w-lg aspect-[4/4.5] flex items-center justify-center">
                
                {/* Green & Orange Backdrop Graphic Shapes */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="absolute right-4 top-10 w-60 h-72 bg-[#0B2E26] rounded-3xl transform rotate-[16deg] shadow-lg" />
                  <div className="absolute right-2 bottom-6 w-44 h-56 bg-[#FF5F38] rounded-3xl transform rotate-[28deg] shadow-md" />
                </div>

                {/* Floating Badge 1 (Top Left) */}
                <div className="absolute top-4 left-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-amber-100/80 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400 text-white flex items-center justify-center shadow-sm">
                    <Check className="w-5 h-5 stroke-[3]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Verified Mentors</div>
                    <div className="text-[10px] font-medium text-slate-500">100% Institutional</div>
                  </div>
                </div>

                {/* Floating Badge 2 (Top Right) */}
                <div className="absolute top-10 right-2 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-lg border border-slate-100 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center font-extrabold text-xs">
                    G
                  </div>
                  <span className="text-xs font-bold text-slate-700">NAAC A+ Certified</span>
                </div>

                {/* Small Floating Circles */}
                <div className="absolute top-1 right-1/3 w-3.5 h-3.5 rounded-full bg-[#FF5F38] shadow-md" />

                {/* Main Student Photo Container */}
                <div className="relative z-10 w-[85%] h-[90%] rounded-2xl overflow-hidden shadow-2xl bg-[#EBE3DC]">
                  <img
                    src="/hero_student_portrait.jpg"
                    alt="Student carrying books"
                    className="w-full h-full object-cover object-top filter contrast-[1.02]"
                  />
                  {/* Subtle fade overlay at the bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </main>

      {/* Spacer to keep layout balanced */}
      <footer className="py-2" />
    </div>
  );
}
