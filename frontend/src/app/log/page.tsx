"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Log {
    _id: string;
    timestamp: string;
    email: string;
    token: string ;
    expiration: string ;
  }

export default function LogPage() {
  const [logs, setLogs] = useState<Log[]>([]);;

  useEffect(() => {
    axios
      .get("/api/log")
      .then((response) => setLogs(response.data))
      .catch((error) => console.error("Error al obtener el log:", error));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Log de Autenticaciones</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Fecha</th>
            <th className="border border-gray-300 p-2">Usuario</th>
            <th className="border border-gray-300 p-2">Token</th>
            <th className="border border-gray-300 p-2">Caducidad</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td className="border border-gray-300 p-2">
                {new Date(log.timestamp).toLocaleString()}
              </td>
              <td className="border border-gray-300 p-2">{log.email}</td>
              <td className="border border-gray-300 p-2">{log.token}</td>
              <td className="border border-gray-300 p-2">
                {new Date(log.expiration).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
