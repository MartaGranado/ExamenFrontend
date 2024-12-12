"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import EventForm from "@/components/EventForm";

export default function EditarEventoPage() {
  const { id } = useParams(); // Obtiene el ID del evento desde la URL dinámica
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const response = await axios.get(`/api/eventos/${id}`);
        setEvento(response.data);
      } catch (err) {
        console.error("Error al cargar el evento:", err);
        setError("No se pudo cargar el evento.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvento();
    }
  }, [id]);

  if (loading) return <p>Cargando evento...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Editar Evento</h1>
      {evento ? <EventForm evento={evento} isEdit={true} /> : <p>No se encontró el evento.</p>}
    </div>
  );
}
