// src/app/api/registro/maestro/route.js
import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      // IDs EXACTOS de tu registrar.html (sección maestro)
      nombre_maestro,
      apellido_maestro,
      // tienes más campos en el form (dui_maestro, telefono_maestro, email_maestro, especialidad, grado_asignado)
      // tu tabla maestro mínima usa nombre/apellido
    } = body || {};

    if (!nombre_maestro || !apellido_maestro) {
      return NextResponse.json(
        { ok: false, error: "Faltan nombre/apellido del docente." },
        { status: 400 }
      );
    }

    const pool = getPool();

    const [r1] = await pool.execute(
      `INSERT INTO maestro (nombre, apellido) VALUES (?, ?)`,
      [nombre_maestro, apellido_maestro]
    );

    return NextResponse.json({ ok: true, idMaestro: r1.insertId });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Error del servidor" }, { status: 500 });
  }
}
