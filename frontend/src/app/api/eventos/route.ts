import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Evento from "@/models/Evento";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import cloudinary from "@/lib/cloudinary";

// export async function GET(request: Request) {
//     await connectToDatabase();
//     console.log("Buscando todos los eventos...");
  
//     // Obtener todos los eventos sin ningún filtro
//     const eventos = await Evento.find({}).sort({ timestamp: 1 });  // Puedes ordenar por timestamp o el campo que prefieras
  
//     console.log("Eventos encontrados:", eventos);
//     return NextResponse.json(eventos);
//   }

async function uploadToCloudinary(file: File): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "eventual" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result?.secure_url || "");
        }
      }
    );
    const buffer = Buffer.from(await file.arrayBuffer());
    stream.end(buffer);
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");

  await connectToDatabase();
  console.log(`Buscando eventos cercanos a (${lat}, ${lon})`);

  const eventos = await Evento.find({
    lat: { $gte: lat - 0.2, $lte: lat + 0.2 },
    lon: { $gte: lon - 0.2, $lte: lon + 0.2 },
  }).sort({ timestamp: 1 });
  console.log(eventos);
  return NextResponse.json(eventos);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }
  
  const formData = await request.formData();
  const nombre = formData.get("nombre")?.toString();
  const lugar = formData.get("lugar")?.toString();
  const timestamp = formData.get("timestamp")?.toString();
  const file = formData.get("imagen") as File | null;

  if (!nombre || !lugar || !timestamp) {
    return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 });
  }

  try {
    // Geocodificación
    const geocodeResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(lugar)}&format=json&limit=1`
    );
    const geocodeData = await geocodeResponse.json();
    const lat = parseFloat(geocodeData[0].lat);
    const lon = parseFloat(geocodeData[0].lon);

      // Subir imagen a Cloudinary
    let imageUrl = "";
    if (file) {
      imageUrl = await uploadToCloudinary(file);
    }

    await connectToDatabase();

    // Crear evento
    const nuevoEvento = new Evento({
      nombre,
      lugar,
      timestamp,
      lat,
      lon,
      organizador: session.user?.email,
      imagen: imageUrl,
    });
    await nuevoEvento.save();

    return NextResponse.json({ message: "Evento creado con éxito" }, { status: 201 });
  } catch (error) {
    console.error("Error al crear evento:", error);
    return NextResponse.json({ message: "Error al crear el evento" }, { status: 500 });
  }
  }

  // export async function PATCH(request: Request) {
  //   const data = await request.json();
  //   await connectToDatabase();
  
  //   const { id, ...updates } = data;
  //   const evento = await Evento.findByIdAndUpdate(id, updates, { new: true });
  
  //   return NextResponse.json(evento);
  // }

  // export async function DELETE(request: Request) {
  //   const { searchParams } = new URL(request.url);
  //   const id = searchParams.get("id");
  
  //   await connectToDatabase();
  //   await Evento.findByIdAndDelete(id);
  
  //   return NextResponse.json({ message: "Evento eliminado con éxito" });
  // }
