import mongoose from "mongoose";

// Esquema de LugarVisitado
const LugarVisitadoSchema = new mongoose.Schema({
  lugar: { type: String, required: true }, // Nombre del lugar (ejemplo: "Madrid, España")
  lat: { type: Number, required: true },  // Latitud de las coordenadas
  lon: { type: Number, required: true },  // Longitud de las coordenadas
  usuario: { type: String, required: true }, // Email del usuario que visitó el lugar
});

// Exporta el modelo LugarVisitado o usa uno existente si ya está definido
export default mongoose.models.LugarVisitado || mongoose.model("LugarVisitado", LugarVisitadoSchema);
