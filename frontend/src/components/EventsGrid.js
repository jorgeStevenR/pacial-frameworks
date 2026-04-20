import EventCard from './EventCard';

const EventsGrid = ({ events, loading, error, page, totalResults, onCargarMas }) => {
  return (
    <div className="results-panel">
      {loading && page === 0 && <div className="empty-state">Cargando eventos...</div>}
      {error && <div className="empty-state error">{error}</div>}
      {!loading && !error && events.length === 0 && page === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h2>Listo para consultar</h2>
          <p>Escribe una búsqueda y pulsa <strong>Ejecutar</strong> para ver eventos en tiempo real.</p>
        </div>
      )}

      {!loading && !error && events.length > 0 && (
        <div className="events-grid">
          {events.map((event, index) => (
            <EventCard key={`${event.title}-${index}`} event={event} index={index} />
          ))}
        </div>
      )}

      {!loading && !error && events.length > 0 && totalResults >= 10 && (
        <div className="pagination-row">
          <button type="button" className="btn-primary" onClick={onCargarMas}>
            Cargar más eventos
          </button>
        </div>
      )}
    </div>
  );
};

export default EventsGrid;
