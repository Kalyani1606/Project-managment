import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "nexus-academic-super-secure-key-2026-phase-1";
export const AUTH_COOKIE_NAME = "nexus_auth_token";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateSecureStudentPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let randomPart = "";
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `Acad#${randomPart}!`;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function getSessionUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload?.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        studentProfile: true,
        teacherProfile: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentProfile: user.studentProfile
        ? {
            ...user.studentProfile,
            skills: JSON.parse(user.studentProfile.skills || "[]"),
          }
        : null,
      teacherProfile: user.teacherProfile
        ? {
            ...user.teacherProfile,
            areasOfExpertise: JSON.parse(user.teacherProfile.areasOfExpertise || "[]"),
          }
        : null,
    };
  } catch (err) {
    console.error("Error getting session user:", err);
    return null;
  }
}
