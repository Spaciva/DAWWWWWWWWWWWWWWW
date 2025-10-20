// src/app/api/login/route.js
import { NextResponse } from "next/server";
import { getPool } from "@/lib/db"; // tu pool existente

export async function POST(req) {
  try {
    const { usuario, contrasena } = await req.json();
    const correo = String(usuario || "").trim();
    const clave  = String(contrasena || "").trim();

    if (!correo || !clave) {
      return NextResponse.json({ ok: false, error: "Faltan campos" }, { status: 400 });
    }

    const pool = getPool();

    // Valida contra tu tabla `usuarios` usando el mismo esquema de hash que ya usas
    const [rows] = await pool.execute(
      `SELECT idUsuario, correo, rol
         FROM usuarios
        WHERE correo = ?
          AND contrasena_hash = SHA2(?, 256)
        LIMIT 1`,
      [correo, clave]
    );

    if (!rows.length) {
      return NextResponse.json({ ok: false, error: "Usuario o contraseña incorrectos" }, { status: 401 });
    }

    const user = {
      id: rows[0].idUsuario,
      correo: rows[0].correo,
      rol: rows[0].rol,
      // si luego agregas columna 'nombre' en usuarios, devuélvela aquí:
      nombre: rows[0].nombre || null
    };

    return NextResponse.json({ ok: true, user });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Error del servidor" }, { status: 500 });
  }
}
