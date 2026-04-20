import { useEffect, useState } from 'react';
import SearchPanel from './components/SearchPanel';
import EventList from './components/EventList';
import EventDetail from './components/EventDetail';
import './App.css';

const initialCity = 'Austin';

function App() {
  const [ciudad, setCiudad] = useState(initialCity);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('todas');
  const [soloVirtual, setSoloVirtual] = useState(false);
  const [page, setPage] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const filtrosDisponibles = {
    'todas': { label: 'Todas las fechas', fecha: null },
    'today': { label: 'Hoy', fecha: 'today' },
    'tomorrow': { label: 'Mañana', fecha: 'tomorrow' },
    'week': { label: 'Esta semana', fecha: 'week' },
    'next_week': { label: 'Próx. semana', fecha: 'next_week' },
    'month': { label: 'Este mes', fecha: 'month' },
    'next_month': { label: 'Próx. mes', fecha: 'next_month' }
  };

  const fetchEvents = async (city, dateFilter = null, virtual = false, pageNum = 0) => {
    setLoading(true);
    setError(null);
    if (pageNum === 0) {
      setEvents([]);
      setSelectedEvent(null);
    }

    try {
      const params = new URLSearchParams({
        ciudad: city,
        hl: 'es',
        gl: 'es',
        start: (pageNum * 10).toString()
      });

      if (dateFilter) {
        params.append('fecha', dateFilter);
      }

      if (virtual) {
        params.append('virtual', 'true');
      }

      const response = await fetch(`http://localhost:3001/eventos?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Error al conectar con el backend');
      }
      const data = await response.json();
      
      if (pageNum === 0) {
        setEvents(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0) {
          setSelectedEvent(data[0]);
        }
      } else {
        setEvents(prev => [...prev, ...(Array.isArray(data) ? data : [])]);
      }
      
      setTotalResults(Array.isArray(data) ? data.length : 0);
    } catch (err) {
      setError(err.message || 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(initialCity);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setPage(0);
    setFechaSeleccionada('todas');
    setSoloVirtual(false);
    fetchEvents(ciudad, null, false, 0);
  };

  const handleFiltroFecha = (filtroKey) => {
    setPage(0);
    setFechaSeleccionada(filtroKey);
    const dateValue = filtrosDisponibles[filtroKey].fecha;
    fetchEvents(ciudad, dateValue, soloVirtual, 0);
  };

  const handleFiltroVirtual = () => {
    setPage(0);
    setSoloVirtual(!soloVirtual);
    const dateValue = fechaSeleccionada !== 'todas' ? filtrosDisponibles[fechaSeleccionada].fecha : null;
    fetchEvents(ciudad, dateValue, !soloVirtual, 0);
  };

  const handleCargarMas = () => {
    const newPage = page + 1;
    setPage(newPage);
    const dateValue = fechaSeleccionada !== 'todas' ? filtrosDisponibles[fechaSeleccionada].fecha : null;
    fetchEvents(ciudad, dateValue, soloVirtual, newPage);
  };

  return (
    <div className="app-shell-layout">
      <div className="app-top">
        <SearchPanel
          ciudad={ciudad}
          setCiudad={setCiudad}
          fechaSeleccionada={fechaSeleccionada}
          soloVirtual={soloVirtual}
          filtrosDisponibles={filtrosDisponibles}
          onSubmit={handleSubmit}
          onFiltroFecha={handleFiltroFecha}
          onFiltroVirtual={handleFiltroVirtual}
        />
      </div>

      <div className="app-main">
        <div className="events-list-section">
          <EventList
            events={events}
            selectedEvent={selectedEvent}
            onSelectEvent={setSelectedEvent}
            loading={loading}
            error={error}
          />
        </div>

        <div className="event-detail-section">
          <EventDetail event={selectedEvent} />
        </div>
      </div>
    </div>
  );
}

export default App;
