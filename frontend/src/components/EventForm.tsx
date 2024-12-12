"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from 'next/image';

interface Event {
  _id?: string; // Campo opcional para soportar edición
  nombre: string;
  lugar: string;
  timestamp: string;
  imagen: string | null; // URL de la imagen actual
}

interface EventFormProps {
  evento?: Event; // El evento puede estar ausente (creación)
  isEdit?: boolean; // Indica si es edición
}

export default function EventForm({ evento, isEdit = false }: EventFormProps) {
  const [formData, setFormData] = useState({
    nombre: evento?.nombre || "",
    lugar: evento?.lugar || "",
    timestamp: evento?.timestamp
      ? new Date(evento.timestamp).toISOString().slice(0, 16)
      : "",
    imagen: null as File | null,
    imagenUrl: evento?.imagen || null, // Muestra la imagen actual si existe
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, imagen: e.target.files[0], imagenUrl: null });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("nombre", formData.nombre);
    data.append("lugar", formData.lugar);
    data.append("timestamp", formData.timestamp);
    if (formData.imagen) {
      data.append("imagen", formData.imagen);
    }

    try {
      if (isEdit) {
        // Editar evento
        await axios.patch(`/api/eventos/${evento?._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Evento actualizado con éxito");
      } else {
        // Crear evento
        await axios.post("/api/eventos", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Evento creado con éxito");
      }
      router.push("/");
    } catch (error) {
      console.error(`Error al ${isEdit ? "editar" : "crear"} el evento:`, error);
      alert("Hubo un error, por favor inténtalo de nuevo.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div>
        <label className="block font-bold">Nombre:</label>
        <input
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre del evento"
          required
          className="border p-2 w-full text-black"
        />
      </div>
      <div>
        <label className="block font-bold">Lugar:</label>
        <input
          name="lugar"
          value={formData.lugar}
          onChange={handleChange}
          placeholder="Dirección del evento"
          required
          className="border p-2 w-full text-black"
        />
      </div>
      <div>
        <label className="block font-bold">Fecha y hora:</label>
        <input
          name="timestamp"
          type="datetime-local"
          value={formData.timestamp}
          onChange={handleChange}
          required
          className="border p-2 w-full text-black"
        />
      </div>
      <div>
        <label className="block font-bold">Imagen:</label>
        {formData.imagenUrl && (
          <div className="mb-2">
            <Image
              src={formData.imagenUrl}
              alt="Imagen actual"
              className="max-w-full h-auto rounded"
              width={500} height={300}
            />
            <p className="text-sm text-gray-500">Imagen actual</p>
          </div>
        )}
        <input
          type="file"
          name="imagen"
          onChange={handleFileChange}
          className="block"
        />
      </div>
      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        {isEdit ? "Guardar cambios" : "Crear evento"}
      </button>
    </form>
  );
}
