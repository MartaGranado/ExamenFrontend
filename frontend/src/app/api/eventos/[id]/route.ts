import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Evento from "@/models/Evento";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/authOptions";
import cloudinary from "@/lib/cloudinary";

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

export async function GET(request: Request, { params }:  { params: Promise<{id:string}>}) {
  const id = (await params).id;
    
  await connectToDatabase();
  
  const eventos = await Evento.findById(id);
  console.log(eventos);
  return NextResponse.json(eventos);
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
    const timestamp = formData.get("timestamp")?.toString();
    const file = formData.get("imagen") as File | null;
  
    if (!nombre || !lugar || !timestamp) {
      return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 });
    }
  
    try {
      // Buscar el evento actual para verificar al organizador
      const evento = await Evento.findById(id);
      if (!evento) {
        return NextResponse.json({ message: "Evento no encontrado" }, { status: 404 });
      }
  
      if (evento.organizador !== session.user?.email) {
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
      let imageUrl = evento.imagen; // Mantener la imagen actual si no se sube una nueva
      if (file) {
        imageUrl = await uploadToCloudinary(file);
      }
  
      // Actualizar el evento
      evento.nombre = nombre;
      evento.lugar = lugar;
      evento.timestamp = timestamp;
      evento.lat = lat;
      evento.lon = lon;
      evento.imagen = imageUrl;
      await evento.save();
  
      return NextResponse.json(evento, { status: 200 });
    } catch (error) {
      console.error("Error al actualizar evento:", error);
      return NextResponse.json({ message: "Error al actualizar el evento" }, { status: 500 });
    }
  }

  export async function DELETE(request: Request, { params }: { params: Promise<{id:string}>}) {
    const id = (await params).id;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "No autenticado" }, { status: 401 });
    }
  
    await connectToDatabase();
    await Evento.findByIdAndDelete(id);
  
    return NextResponse.json({ message: "Evento eliminado con éxito" });
  }