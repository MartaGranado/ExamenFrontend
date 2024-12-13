"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import MarkerForm from "@/components/MarkerForm";

export default function EditarMarcadorPage() {
  const { id } = useParams(); // Obtiene el ID del marcador desde la URL dinámica
  const [marcador, setMarcador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarcador = async () => {
      try {
        const response = await axios.get(`/api/marcadores/${id}`);
        setMarcador(response.data);
      } catch (err) {
        console.error("Error al cargar el marcador:", err);
        setError("No se pudo cargar el marcador.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMarcador();
    }
  }, [id]);

  if (loading) return <p>Cargando marcador...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Editar Marcador</h1>
      {marcador ? <MarkerForm marcador={marcador} isEdit={true} /> : <p>No se encontró el marcador.</p>}
    </div>
  );
}
