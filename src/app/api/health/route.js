// src/app/api/health/route.js
import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query("SELECT 1 AS ok");
    return NextResponse.json({ ok: true, db: rows[0] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
