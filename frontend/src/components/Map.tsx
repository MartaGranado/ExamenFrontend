import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Marker, Popup, TileLayer, MapContainer, useMap } from "react-leaflet";
import L from "leaflet";

// Cargar el componente dinámicamente para evitar problemas con el lado del servidor
const Map = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), {
  ssr: false,
});

// Icono personalizado para los marcadores del mapa
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Marker {
  _id: string;
  nombre: string;
  lugar: string;
  lat: number;
  lon: number;
  imagen: string;  // La propiedad de la imagen se agrega aquí
}

interface MapProps {
  location: { lat: number; lon: number };
  marcadores: Marker[];
  setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>; // Función para actualizar la imagen seleccionada
}

// Componente para ajustar automáticamente la vista según los marcadores
const FitBoundsAutomatically: React.FC<{ markers: Marker[] }> = ({ markers }) => {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(
        markers.map((marker) => [marker.lat, marker.lon])
      );
      map.fitBounds(bounds, { padding: [50, 50] }); // Padding para dar espacio a los marcadores
    }
  }, [markers, map]);

  return null;
};

const MarkerMap: React.FC<MapProps> = ({ location, marcadores, setSelectedImage }) => {
  const [zoom, setZoom] = useState(13);

  useEffect(() => {
    if (location.lat && location.lon) {
      setZoom(13);
    }
  }, [location]);

  // Maneja el clic en un marcador y establece la imagen correspondiente
  const handleMarkerClick = (imagen: string) => {
    setSelectedImage(imagen);  // Actualiza la imagen seleccionada
  };

  return (
    <MapContainer
      center={[location.lat, location.lon]}
      zoom={zoom}
      style={{ height: "400px", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {marcadores.map((marcador) => (
        <Marker
          key={marcador._id}
          position={[marcador.lat, marcador.lon]}
          icon={customIcon}
          eventHandlers={{
            click: () => handleMarkerClick(marcador.imagen) // Al hacer clic en el marcador, se establece la imagen correspondiente
          }}
        >
          <Popup>
            <strong>{marcador.nombre}</strong>
            <br />
            {marcador.lugar}
          </Popup>
        </Marker>
      ))}
      <FitBoundsAutomatically markers={marcadores} />
    </MapContainer>
  );
};

export default MarkerMap;
