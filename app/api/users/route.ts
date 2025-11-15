import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

// obtener los usuarios con paginación
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    // obtener parámetros de paginación
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const skip = (page - 1) * limit;

    // obtener el total de usuarios
    const total = await User.countDocuments();

    // obtener usuarios con paginación
    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return NextResponse.json({
      users,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error obteniendo usuarios" },
      { status: 500 }
    );
  }
}

// crear un nuevo usuario
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const data = await req.json();

    // validar datos
    if (!data.name || !data.email || !data.password) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // crear usuario
    const newUser = await User.create(data);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creando usuario" },
      { status: 500 }
    );
  }
}
