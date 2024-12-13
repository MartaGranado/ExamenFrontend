import { useRouter } from 'next/navigation';

const EventList: React.FC<{ events: any[] }> = ({ events }) => {
  const router = useRouter();

  return (
    <ul>
      {events.map((event) => (
        <li key={event._id} className="border p-4 mb-2 mr-5">
          <h3 className="text-lg font-bold">{event.nombre}</h3>
          <p>Organizador: {event.organizador}</p>
          <p>Fecha: {new Date(event.timestamp).toLocaleString()}</p>
          <button
            onClick={() => router.push(`/${event._id}`)}
            className="text-blue-500"
          >
            Ver detalles
          </button>
        </li>
      ))}
    </ul>
  );
};

export default EventList;