import { useRouter } from 'next/navigation';

interface Marker {
  _id: string;
  nombre: string;
  lugar: string;
  organizador: string;
  imagen: string; // URI de la imagen
}

const MarkerList: React.FC<{ markers: Marker[] }> = ({ markers }) => {
  const router = useRouter();

  const allImages = markers.map((marker) => marker.imagen).filter(Boolean);

  return (
    <div>
      {/* Lista de marcadores con sus imágenes */}
      <ul>
        {markers.map((marker) => (
          <li key={marker._id} className="border p-4 mb-2">
            <h3 className="text-lg font-bold">{marker.nombre}</h3>
            <p>Creador: {marker.organizador}</p>
            {marker.imagen && (
              <img
                src={marker.imagen}
                alt={`${marker.nombre} - Imagen`}
                className="w-full max-h-48 object-cover rounded mt-2"
              />
            )}
            <button
              onClick={() => router.push(`/${marker._id}`)}
              className="text-blue-500"
            >
              Ver detalles
            </button>
          </li>
        ))}
      </ul>

      {/* Carrusel de imágenes del usuario */}
      {allImages.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Todas las Imágenes</h2>
          <div className="flex gap-4 overflow-x-auto">
            {allImages.map((image, index) => (
              <img
                key={index}
                src={image}
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
