import { useRouter } from 'next/navigation';

interface Marker {
  _id: string;
  nombre: string;
  lugar: string;
  organizador: string;
  imagen: string; // URI de la imagen
}

const MarkerList: React.FC<{ markers: Marker[] }> = ({ markers }) => {
  // Filtrar los marcadores que tienen una imagen válida
  const markersWithImages = markers.filter(marker => marker.imagen && marker.imagen.trim() !== "");

  return (
    <div>
      {/* Lista de marcadores con su nombre y su imagen, solo si tienen imagen */}
      {markersWithImages.length === 0 ? (
        <p>No hay marcadores disponibles con imágenes.</p>
      ) : (
        <ul>
          {markersWithImages.map((marker) => (
            <li key={marker._id} className="border p-4 mb-2 flex flex-col items-center">
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

      {/* Carrusel de imágenes del usuario */}
      {markersWithImages.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Todas las Imágenes</h2>
          <div className="flex gap-4 overflow-x-auto">
            {markersWithImages.map((marker, index) => (
              <img
                key={index}
                src={marker.imagen}
                alt={`Imagen ${index + 1}`}
                className="w-48 h-32 object-cover rounded shadow"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkerList;
