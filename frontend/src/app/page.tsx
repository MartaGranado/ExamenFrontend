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
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState({ lat: 0, lon: 0 });
  const [marcadores, setMarcadores] = useState([]);

  // Obtener los marcadores asociados a un correo electrónico
  const fetchMarcadores = async (correo) => {
    try {
      const res = await axios.get(`/api/marcadores?email=${correo}`);
      setMarcadores(res.data);
    } catch (error) {
      console.error("Error al obtener marcadores:", error);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchMarcadores(session.user.email); // Cargar marcadores del usuario autenticado al inicio
    }
  }, [session]);

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-6 bg-gray-200 shadow-lg rounded-md max-w-lg text-center">
          <h1 className="text-2xl font-bold mb-4 text-black">Bienvenido a Mis Mapas</h1>
          <p className="mb-4 text-black">Inicia sesión para acceder al mapa y agregar tus ubicaciones.</p>
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

  const esPropioCorreo = email === "" || email === session.user.email;

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <div className="flex flex-col md:flex-row gap-8 items-start w-full max-w-5xl">
        {/* Formulario */}
        <div className="p-6 bg-blue-950 shadow-lg rounded-md max-w-md text-center w-full md:w-1/3">
          <h1 className="text-2xl font-bold mb-4">
            {esPropioCorreo ? "Mis mapas" : `Mapas de: ${email}`}
          </h1>
          <div className="flex flex-col gap-4">
            <Link href={`/crear`}>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Añadir localización
              </button>
            </Link>
            <p>Ver mapa de:</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa un correo electrónico"
              className="border p-2 w-full text-black rounded-md"
            />
            <button
              onClick={() => fetchMarcadores(email)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Buscar
            </button>
          </div>
        </div>

        {/* Mapa */}
        <div className="w-full md:w-2/3">
          <Map marcadores={marcadores} location={location} />
        </div>
      </div>

      {/* Lista de marcadores */}
      <div className="mt-8 w-full max-w-5xl mx-auto">
        <MarkerList markers={marcadores} />
      </div>
    </div>
  );
}
