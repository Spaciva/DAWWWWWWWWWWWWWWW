// src/app/api/registro/alumno/route.js
import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

function generarCarnet() {
  const n = Math.floor(Math.random() * 100); // 0..99
  return `A${String(n).padStart(2, '0')}`;   // A00..A99
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      nombre_estudiante,
      apellido_estudiante,
      // opcional si lo agregas al form:
      carnet,
    } = body || {};

    if (!nombre_estudiante || !apellido_estudiante) {
      return NextResponse.json(
        { ok: false, error: "Faltan nombre/apellido del alumno." },
        { status: 400 }
      );
    }

    const pool = getPool();

    // Tu tabla alumno = (idAlumno, nombre, apellido, carnet)
    const carnetFinal = (carnet && carnet.trim()) || generarCarnet();

    const [r1] = await pool.execute(
      `INSERT INTO alumno (nombre, apellido, carnet) VALUES (?, ?, ?)`,
      [nombre_estudiante, apellido_estudiante, carnetFinal]
    );

    return NextResponse.json({ ok: true, idAlumno: r1.insertId, carnet: carnetFinal });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Error del servidor" }, { status: 500 });
  }
}
