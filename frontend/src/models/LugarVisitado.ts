// models/LugarVisitado.js
import mongoose from "mongoose";

const lugarVisitadoSchema = new mongoose.Schema({
  lugar: String,
  lat: Number,
  lon: Number,
  usuario: String,
  imagen: { type: String, required: false }, // Agregar campo de imagen
});

const Marcador = mongoose.models.Marcador || mongoose.model("Marcador", lugarVisitadoSchema);

export default Marcador;
