import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Log from "@/models/Log";

export async function GET() {
  try {
    await connectToDatabase();

    // Obtener el log en orden descendente de timestamp
    const logs = await Log.find().sort({ timestamp: -1 });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error al obtener el log:", error);
    return NextResponse.json({ message: "Error al obtener el log" }, { status: 500 });
  }
}
