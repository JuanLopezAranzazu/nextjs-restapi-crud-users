import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { isValidObjectId } from "@/lib/validateObjectId";
import User from "@/models/User";

// obtener un usuario por id
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // validar id
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: "ID de usuario no válido" },
        { status: 400 }
      );
    }

    // buscar usuario
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Error obteniendo el usuario" },
      { status: 500 }
    );
  }
}

// actualizar un usuario por id
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // validar id
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: "ID de usuario no válido" },
        { status: 400 }
      );
    }

    const data = await req.json();

    // validar email único
    if (data.email) {
      const existingUser = await User.findOne({
        email: data.email,
        _id: { $ne: id },
      });
      if (existingUser) {
        return NextResponse.json(
          { error: "El email ya está en uso por otro usuario" },
          { status: 400 }
        );
      }
    }

    // actualizar usuario
    const updated = await User.findByIdAndUpdate(id, data, { new: true });
    if (!updated) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Error actualizando el usuario" },
      { status: 500 }
    );
  }
}

// eliminar un usuario por id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // validar id
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: "ID de usuario no válido" },
        { status: 400 }
      );
    }

    // eliminar usuario
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error eliminando el usuario" },
      { status: 500 }
    );
  }
}
