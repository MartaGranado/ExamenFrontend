"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from 'next/image';

interface MarkerDetails {
  _id: string;
  nombre: string;
  timestamp: string;
  lugar: string;
  lat: number;
  lon: number;
  organizador: string;
  imagen: string;
}

const MarkerDetailsPage: React.FC = () => {
  const router = useRouter();
  const [marker, setMarker] = useState<MarkerDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

   // Obtén el ID del marcadores de la URL
   useEffect(() => {
    const id = window.location.pathname.split("/").pop(); // Extrae el ID de la ruta dinámica
    if (!id) return;

    const fetchMarkerDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/marcadores/${id}`);
        setMarker(response.data);
      } catch (err) {
        setError("Error al cargar los detalles del marcador.");
      } finally {
        setLoading(false);
      }
    };

    fetchMarkerDetails();
  }, []);

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de que deseas eliminar este marcador?")) {
      try {
        await axios.delete(`/api/marcadores/${marker?._id}`);
        alert("Marcador eliminado exitosamente");
        router.push("/"); // Redirigir a la página principal después de borrar
      } catch (err) {
        alert("Error al eliminar el marcador");
      }
    }
  };
  

  if (loading) return <p>Cargando detalles del marcador...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
       <button
            onClick={() => router.back()}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          >
            Volver a la lista
          </button>
      {marker ? (
        <div className="border p-4 rounded shadow-md">
          <h1 className="text-2xl font-bold mb-4">{marker.nombre}</h1>
          <Image src={marker.imagen} alt={marker.nombre} className="my-4 max-w-full h-auto" width={1000} height={1000}/>
          <p><strong>Organizador:</strong> {marker.organizador}</p>
          <p><strong>Dirección:</strong> {marker.lugar}</p>
          <p><strong>Coordenadas:</strong> Lat {marker.lat}, Lon {marker.lon}</p>
          <div className="flex space-x-2 mt-4">
        <Link href={`/${marker._id}/editar`}>
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
        <p>No se encontraron detalles para este marcador.</p>
      )}
    </div>
  );
};

export default MarkerDetailsPage;
