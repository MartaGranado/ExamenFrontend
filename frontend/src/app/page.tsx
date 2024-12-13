"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import EventList from "@/components/EventList";
import Link from "next/link";
import dynamic from "next/dynamic";
// const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState({ lat: 0, lon: 0 });
  const [eventos, setEventos] = useState([]);

  const handleSearch = async () => {
    try {
      // Geocodificar la dirección ingresada
      const geocodeResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
      );
      const { lat, lon } = geocodeResponse.data[0];
      setLocation({ lat: parseFloat(lat), lon: parseFloat(lon) });

      // Buscar eventos próximos
      const eventosResponse = await axios.get(`/api/eventos?lat=${lat}&lon=${lon}`);
      setEventos(eventosResponse.data);
    } catch (error) {
      console.error("Error al buscar eventos:", error);
    }
  };

  // useEffect(() => {
  //   // Llamada para obtener todos los eventos
  //   const fetchEventos = async () => {
  //     try {
  //       const response = await axios.get("/api/eventos");  // Cambia la URL si es necesario
  //       setEventos(response.data);  // Asignamos los eventos obtenidos a la variable de estado
  //       console.log(response.data);
  //     } catch (error) {
  //       console.error("Error al obtener eventos:", error);
  //     }
  //   };

  //   fetchEventos();
  // }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-6 bg-grey-200 shadow-lg rounded-md max-w-lg text-center ml-4">
        <h1 className="text-2xl font-bold mb-4">Buscar Eventos Cercanos</h1>
        <div className="flex flex-col gap-4">
          <Link href={`/crear`}>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Crear
            </button>
          </Link>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Ingresa una dirección"
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

      {/* Mapa debajo del botón Buscar */}
      <div className="mt-8 w-full max-w-lg mx-auto">
        <Map eventos={eventos} location={location} />
      </div>

      {/* Lista de eventos debajo del mapa */}
      <EventList events={eventos} />
    </div>
  );
}
