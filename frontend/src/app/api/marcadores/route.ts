import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Marcador from "@/models/LugarVisitado";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }

  const url = new URL(request.url);
  const email = url.searchParams.get("email") || session.user?.email;

  if (!email) {
    return NextResponse.json({ message: "No se proporcionó un correo válido" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const marcadores = await Marcador.find({ usuario: email });
    return NextResponse.json(marcadores);
  } catch (error) {
    console.error("Error al obtener marcadores:", error);
    return NextResponse.json({ message: "Error al obtener marcadores" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }

  const formData = await request.formData();
  const nombre = formData.get("nombre")?.toString();
  const lugar = formData.get("lugar")?.toString();

  if (!nombre || !lugar) {
    return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 });
  }

  try {
    const geocodeResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(lugar)}&format=json&limit=1`
    );
    const geocodeData = await geocodeResponse.json();

    if (geocodeData.length === 0) {
      return NextResponse.json({ message: "No se encontraron coordenadas para el lugar" }, { status: 400 });
    }

    const { lat, lon } = geocodeData[0];

    await connectToDatabase();

    const nuevoMarcador = new Marcador({
      nombre,
      lugar,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      usuario: session.user.email,
    });

    await nuevoMarcador.save();

    return NextResponse.json({ message: "Marcador creado con éxito" }, { status: 201 });
  } catch (error) {
    console.error("Error al crear marcador:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
