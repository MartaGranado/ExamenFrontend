import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Marcador from "@/models/LugarVisitado";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import cloudinary from "@/lib/cloudinary";

async function uploadToCloudinary(file: File): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "mimapa" },
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

export async function GET(request: Request, { params }:  { params: Promise<{id:string}>}) {
  const id = (await params).id;
    
  await connectToDatabase();
  
  const marcadores = await Marcador.findById(id);
  console.log(marcadores);
  return NextResponse.json(marcadores);
}


  export async function PATCH(request: Request, { params }:  { params: Promise<{id:string}>}) {
    const id = (await params).id;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "No autenticado" }, { status: 401 });
    }
    await connectToDatabase();
  
    const formData = await request.formData();
    const nombre = formData.get("nombre")?.toString();
    const lugar = formData.get("lugar")?.toString();
    const file = formData.get("imagen") as File | null;
  
    if (!nombre || !lugar ) {
      return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 });
    }
  
    try {
      // Buscar el marcador actual para verificar al organizador
      const marcador = await Marcador.findById(id);
      if (!marcador) {
        return NextResponse.json({ message: "Marcador no encontrado" }, { status: 404 });
      }
  
      if (marcador.organizador !== session.user?.email) {
        return NextResponse.json({ message: "No autorizado" }, { status: 403 });
      }
  
      // Geocodificación
      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(lugar)}&format=json&limit=1`
      );
      const geocodeData = await geocodeResponse.json();
      const lat = parseFloat(geocodeData[0].lat);
      const lon = parseFloat(geocodeData[0].lon);
  
      // Subir imagen a Cloudinary si hay una nueva imagen
      let imageUrl = marcador.imagen; // Mantener la imagen actual si no se sube una nueva
      if (file) {
        imageUrl = await uploadToCloudinary(file);
      }
  
      // Actualizar el marcador
      marcador.nombre = nombre;
      marcador.lugar = lugar;
      marcador.lat = lat;
      marcador.lon = lon;
      marcador.imagen = imageUrl;
      await marcador.save();
  
      return NextResponse.json(marcador, { status: 200 });
    } catch (error) {
      console.error("Error al actualizar marcador:", error);
      return NextResponse.json({ message: "Error al actualizar el marcador" }, { status: 500 });
    }
  }

  export async function DELETE(request: Request, { params }: { params: Promise<{id:string}>}) {
    const id = (await params).id;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "No autenticado" }, { status: 401 });
    }
  
    await connectToDatabase();
    await Marcador.findByIdAndDelete(id);
  
    return NextResponse.json({ message: "Marcador eliminado con éxito" });
  }