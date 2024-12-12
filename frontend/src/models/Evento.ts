import { Schema, model, models } from "mongoose";

const EventoSchema = new Schema({
  nombre: { type: String, required: true },
  timestamp: { type: Date, required: true },
  lugar: { type: String, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  organizador: { type: String, required: true },
  imagen: { type: String, required: false },
});

const Evento = models.Evento || model("Evento", EventoSchema);

export default Evento;
