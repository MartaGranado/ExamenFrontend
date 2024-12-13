"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import axios from "axios";
import MarkerList from "@/components/MarkerList";
import Link from "next/link";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  const { data: session, status } = useSession(); // Hook para manejar la sesión
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState({ lat: 0, lon: 0 });
  const [marcadores, setMarcadores] = useState([]);

  const handleSearch = async () => {
    try {
      // Geocodificar la dirección ingresada
      const geocodeResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
      );
      const { lat, lon } = geocodeResponse.data[0];
      setLocation({ lat: parseFloat(lat), lon: parseFloat(lon) });

      // Buscar marcadores próximos
      const marcadoresResponse = await axios.get(`/api/marcadores?lat=${lat}&lon=${lon}`);
      setMarcadores(marcadoresResponse.data);
    } catch (error) {
      console.error("Error al buscar marcadores:", error);
    }
  };

  // if (status === "loading") {
  //   return <div>Cargando...</div>;
  // }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-6 bg-grey-200 shadow-lg rounded-md max-w-lg text-center">
          <h1 className="text-2xl font-bold mb-4">Bienvenido a Mis Mapas</h1>
          <p className="mb-4">Inicia sesión para acceder al mapa y agregar tus ubicaciones.</p>
          <button
            onClick={() => signIn()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-6 bg-grey-200 shadow-lg rounded-md max-w-lg text-center ml-4">
        <h1 className="text-2xl font-bold mb-4">Mis mapas</h1>
        <div className="flex flex-col gap-4">
          <Link href={`/crear`}>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Añadir país
            </button>
          </Link>
          <p>Ver mapa de:</p>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Ingresa una dirección de correo"
            className="border p-2 w-full text-black rounded-md"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Buscar
          </button>
        </div>
      </div>

      <div className="mt-8 w-full max-w-lg mx-auto">
        <Map marcadores={marcadores} location={location} />
      </div>

      <MarkerList markers={marcadores} />
    </div>
  );
}
