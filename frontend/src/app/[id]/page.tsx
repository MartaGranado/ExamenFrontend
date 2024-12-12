"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from 'next/image';

interface EventDetails {
  _id: string;
  nombre: string;
  timestamp: string;
  lugar: string;
  lat: number;
  lon: number;
  organizador: string;
  imagen: string;
}

const EventDetailsPage: React.FC = () => {
  const router = useRouter();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

   // Obtén el ID del evento de la URL
   useEffect(() => {
    const id = window.location.pathname.split("/").pop(); // Extrae el ID de la ruta dinámica
    if (!id) return;

    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/eventos/${id}`);
        setEvent(response.data);
      } catch (err) {
        setError("Error al cargar los detalles del evento.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, []);

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de que deseas eliminar este evento?")) {
      try {
        await axios.delete(`/api/eventos/${event?._id}`);
        alert("Evento eliminado exitosamente");
        router.push("/"); // Redirigir a la página principal después de borrar
      } catch (err) {
        alert("Error al eliminar el evento");
      }
    }
  };
  

  if (loading) return <p>Cargando detalles del evento...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
       <button
            onClick={() => router.back()}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          >
            Volver a la lista
          </button>
      {event ? (
        <div className="border p-4 rounded shadow-md">
          <h1 className="text-2xl font-bold mb-4">{event.nombre}</h1>
          <Image src={event.imagen} alt={event.nombre} className="mb-4 w-full h-64 object-cover" width={500} height={300}/>
          <p><strong>Fecha y hora:</strong> {new Date(event.timestamp).toLocaleString()}</p>
          <p><strong>Organizador:</strong> {event.organizador}</p>
          <p><strong>Dirección:</strong> {event.lugar}</p>
          <p><strong>Coordenadas:</strong> Lat {event.lat}, Lon {event.lon}</p>
          <div className="flex space-x-2 mt-4">
        <Link href={`/${event._id}/editar`}>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Editar
          </button>
        </Link>
        <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Eliminar
          </button>
      </div>
          
        </div>
        
      ) : (
        <p>No se encontraron detalles para este evento.</p>
      )}
    </div>
  );
};

export default EventDetailsPage;
