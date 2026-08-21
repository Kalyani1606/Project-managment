import { NextResponse } from "next/server";
import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);

export async function POST() {
  try {
    const { stdout, stderr } = await execPromise("node prisma/seed.js");
    return NextResponse.json({
      success: true,
      message: "Database reseeded successfully",
      output: stdout || stderr,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to seed" }, { status: 500 });
  }
}
