import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

// POST /api/usuarios  -> crea un usuario
export async function POST(req) {
  try {
    const body = await req.json();
    // Mantengo tus IDs y nombres del front como están:
    // usaré "usuario" como correo/email para no tocar tu HTML/CSS
    const correo = String(body.usuario || '').trim();
    const clave  = String(body.contrasena || '').trim();
    const rol    = String(body.rol || 'alumno').trim(); // 'admin' | 'maestro' | 'alumno'

    if (!correo || !clave) {
      return NextResponse.json({ ok:false, error:'Faltan campos' }, { status:400 });
    }

    const pool = getPool();

    // Verificar duplicado
    const [dup] = await pool.execute('SELECT 1 FROM usuarios WHERE correo=? LIMIT 1', [correo]);
    if (dup.length) {
      return NextResponse.json({ ok:false, error:'Ese usuario/correo ya existe' }, { status:409 });
    }

    // Insertar (tu login usa SHA2(?,256) en SQL)
    await pool.execute(
      'INSERT INTO usuarios (correo, contrasena_hash, rol) VALUES (?, SHA2(?,256), ?)',
      [correo, clave, rol]
    );

    return NextResponse.json({ ok:true, message:'Usuario creado' }, { status:201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok:false, error:'Error del servidor' }, { status:500 });
  }
}
