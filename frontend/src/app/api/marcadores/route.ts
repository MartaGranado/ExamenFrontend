import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import LugarVisitado from "@/models/LugarVisitado";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Ruta para obtener lugares visitados por el usuario
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    // Obtener lugares visitados por el usuario
    const lugares = await LugarVisitado.find({ usuario: session.user?.email });
    return NextResponse.json(lugares);
  } catch (error) {
    console.error("Error al obtener lugares visitados:", error);
    return NextResponse.json({ message: "Error al obtener lugares" }, { status: 500 });
  }
}

// Ruta para agregar un nuevo lugar visitado
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }

  const formData = await request.formData();
  const lugar = formData.get("lugar")?.toString();

  if (!lugar) {
    return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 });
  }

  try {
    // Geocodificación para obtener las coordenadas del lugar
    const geocodeResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(lugar)}&format=json&limit=1`
    );
    const geocodeData = await geocodeResponse.json();

    if (geocodeData.length === 0) {
      return NextResponse.json({ message: "No se encontraron coordenadas para el lugar" }, { status: 400 });
    }

    const lat = parseFloat(geocodeData[0].lat);
    const lon = parseFloat(geocodeData[0].lon);

    await connectToDatabase();

    // Guardar el lugar en la base de datos
    const nuevoLugar = new LugarVisitado({
      lugar,
      lat,
      lon,
      usuario: session.user?.email,
    });
    await nuevoLugar.save();

    return NextResponse.json({ message: "Lugar agregado con éxito" }, { status: 201 });
  } catch (error) {
    console.error("Error al agregar lugar:", error);
    return NextResponse.json({ message: "Error al agregar lugar" }, { status: 500 });
  }
}