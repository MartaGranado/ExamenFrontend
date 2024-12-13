import { useState } from "react";

interface Marker {
  _id: string;
  nombre: string;
  lugar: string;
  organizador: string;
  imagen: string; // URI de la imagen
}

const MarkerList: React.FC<{ markers: Marker[]; selectedImage: string | null }> = ({
  markers,
  selectedImage,
}) => {
  // Filtrar los marcadores que tienen una imagen válida
  const markersWithImages = markers.filter(
    (marker) => marker.imagen && marker.imagen.trim() !== ""
  );

  return (
    <div>
      {/* Si hay una imagen seleccionada, no mostrar la lista de marcadores */}
      {!selectedImage && (
        <>
          {/* Lista de marcadores con su nombre y su imagen, solo si tienen imagen */}
          {markersWithImages.length === 0 ? (
            <p>No hay marcadores disponibles con imágenes.</p>
          ) : (
            <ul>
              {markersWithImages.map((marker) => (
                <li
                  key={marker._id}
                  className="border p-4 mb-2 flex flex-col items-center"
                >
                  <h3 className="text-lg font-bold mb-2">{marker.nombre}</h3>
                  <img
                    src={marker.imagen}
                    alt={`${marker.nombre} - Imagen`}
                    className="w-full max-h-48 object-cover rounded"
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default MarkerList;
